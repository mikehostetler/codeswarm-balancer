require('colors');

var net = require('net'),
  DuplexEmitter = require('duplex-emitter'),
  Station = require('./station');


var Dispatcher = function() {
  var self = this;

  this.port = process.env.PRODUCERS_PORT || 5000;
  this.server = net.createServer(onConnection);
  this.station = new Station(process.env.WORKERS_PORT || 5005);
  this.station.start();
  this.producers = [];

  this.station.on('workerConnected', onWorkerConnected);

  function onWorkerConnected(worker) {
    self.handshake();
  }

  function onConnection(socket) {
    console.log('Producer connected!'.green);
    var remote = DuplexEmitter(socket);

    var producer = {'remote': remote, 'socket': socket};
    self.producers.push(producer);

    remote.on('init', function(type) {
      producer.runner = new Runner(producer.remote, worker.remote, type);
    });

    remote.on('spawn', function(command, args, env) {
      producer.runner.run(command, args, env);
    });

    self.handshake();
  }
};


Dispatcher.prototype.handshake = function() {
  if(this.producers.length > 0 && this.station.workers.length > 0) {
    var producer = this.producers.shift();
    producer.worker = this.station.workers.shift();
    producer.remote.emit('ready');
  }
};


Dispatcher.prototype.start = function() {
  this.server.listen(this.port, function() {
    console.log('Dispatcher listening!'.green);
  });
};


module.exports = Dispatcher;
