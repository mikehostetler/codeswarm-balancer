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
    self.consume();
  }

  function onConnection(socket) {
    console.log('Producer connected!'.green);
    var remote = DuplexEmitter(socket);
    var queue = [];

    var producer = {'remote': remote, 'socket': socket, 'queue': queue};
    self.producers.push(producer);

    remote.on('spawn', function(command, args, env) {
      queue.push({'command': command, 'args': args, 'env': env});
      self.consume();
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


Dispatcher.prototype.consume = function() {
  if(this.producers.length > 0) {
    var producer = this.producers[0];
    var worker = this.station.workers.shift();

    if(producer && worker) {
      var job = producer.queue.shift();
      if(job) {
        worker.remote.on('done', function(data) {
          producer.remote.emit('done', data);
        });
        worker.remote.on('stdout', function(data) {
          producer.remote.emit('stdout', data);
        });
        worker.remote.on('stderr', function(data) {
          producer.remote.emit('stderr', data);
        });
        worker.remote.emit('spawn', job.command, job.args, job.env);
      }
    }
  }
};


Dispatcher.prototype.start = function() {
  this.server.listen(this.port, function() {
    console.log('Dispatcher listening!'.green);
  });
};


module.exports = Dispatcher;
