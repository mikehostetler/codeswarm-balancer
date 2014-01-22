require('colors');

var propagate = require('propagate');

var Runner = function(type) {
  this.type = type;
  this.worker = worker;
  this.producer = producer;

  this.worker.emit('init', type);

  propagate(['initialised', 'stderr', 'stdout', 'done'], this.worker, this.producer);
};

Runner.prototype.run = function (command, args, env) {
  this.worker.emit('spawn', command, args, env);
};
