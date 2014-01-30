require('colors');

var propagate = require('propagate');

var Runner = function(producer, worker, type) {
  var self = this;

  this.type = type;
  this.worker = worker;
  this.producer = producer;

  this.worker.emit('init', type);
  
  
  this.worker.on('initialised', function(data) {
    self.producer.emit('initialised', data);
  });

  this.worker.on('stderr', function(data) {
    self.producer.emit('stderr', data);
  });

  this.worker.on('stdout', function(data) {
    self.producer.emit('stdout', data);
  });

  this.worker.on('done', function(data) {
    self.producer.emit('done', data);
  });

  this.worker.on('close', function(data) {
    self.producer.emit('close', data);
  });

  //propagate(['initialised', 'stderr', 'stdout', 'done', 'close'], this.worker, this.producer);
};

Runner.prototype.run = function (command, args, env) {
  this.worker.emit('spawn', command, args, env);
};

module.exports = Runner;