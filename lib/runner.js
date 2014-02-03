require('colors');
var DuplexEmitter = require('duplex-emitter');

var Runner = function(producer, worker, type) {
  var self = this;

  this.type = type;
  this.worker = worker;
  this.producer = producer;

  this.producerRemote = DuplexEmitter(producer);
  this.workerRemote = DuplexEmitter(worker);

  this.producerRemote.on('init', function(type) {
    console.log(self.id + ' received init: ' + type);
    self.workerRemote.emit('init', type);
  });

  this.workerRemote.on('initialised', function(data) {
    self.producerRemote.emit('initialised', data);
  });

  this.workerRemote.on('stderr', function(data) {
    self.producerRemote.emit('stderr', data);
  });

  this.workerRemote.on('stdout', function(data) {
    self.producerRemote.emit('stdout', data);
  });

  this.workerRemote.on('done', function(data) {
    self.producerRemote.emit('done', data);
  });

  this.workerRemote.on('close', function(data) {
    self.producerRemote.emit('close', data);
  });

  this.producerRemote.on('spawn', function(command, args, env) {
    console.log(self.id + ' spawning ' + command);
    self.workerRemote.emit('spawn', command, args, env);
  });

  producer.once('end', onEnd);
  producer.on('error', onEnd);

  function onEnd() {
    self.worker.end();
  }

  self.producerRemote.emit('handshaked');
};

module.exports = Runner;