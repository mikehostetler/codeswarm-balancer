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
    var queue = [];

    var producer = {'remote': remote, 'socket': socket};
    self.producers.push(producer);

    remote.on('job', function(job) {
      producer.job = job;
      self.handshake();
    });

    socket.once('end', onEnd);
    socket.on('error', onEnd);

    function onEnd() {
      console.log('Producer disconnected!'.red);
      var i = self.producers.indexOf(producer);
      if (i >= 0) {
        self.producers.splice(i, 1);
        console.log('Producer removed!'.yellow);
      }
    }
  }
};


Dispatcher.prototype.handshake = function() {
  if(this.producers.length > 0 && this.station.workers.length > 0) {
    var producer = this.producers.shift();
    var worker = this.station.workers.shift();

    var runner = new Runner(producer.remote, worker.remote, producer.job);
  }
};


Dispatcher.prototype.start = function() {
  this.server.listen(this.port, function() {
    console.log('Dispatcher listening!'.green);
  });
};


module.exports = Dispatcher;
