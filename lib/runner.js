require('colors');

var sys = require('sys');

var Runner = function(producer, worker, job) {
  var self = this;

  this.producer = producer;
  this.worker = worker;
  this.job = job;

  this.worker.emit('init', job.type);

  this.worker.on('initialised', function() {
    self.consume();
  });
};

sys.inherits(Runner, events.EventEmitter);

Runner.prototype.run = function (command, args, env) {
  var self = this;
  
  this.worker.on('stderr', function(data) {
    self.producer.emit('stderr', data);
  });

  this.worker.on('stdout', function(data) {
    self.producer.emit('stdout', data);
  });

  this.worker.on('done', function(code) {
    self.producer.emit('done', code);
    self.consume();
  });

  this.worker.emit('spawn', command, args, env);
};

Consume.prototype.consume = function() {
  if(this.job.commands.length > 0) {
    var order = this.job.commands.shift();
    this.run(order.command, order.args, order.env);
  } else {
    this.producer.emit('done');
  }
};