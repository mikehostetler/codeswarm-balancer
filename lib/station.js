require('colors');

var net = require('net'),
  events = require('events'),
  sys = require('sys');


var Station = function(port) {
  var self = this;

  this.port = port;
  this.server = net.createServer(onConnection);
  this.workers = [];

  function onConnection(socket) {
    console.log('Worker connected!'.green);

    self.workers.push(socket);

    socket.once('end', onEnd);
    socket.on('error', onEnd);

    function onEnd() {
      console.log('Worker disconnected!'.red);
      var i = self.workers.indexOf(socket);
      if (i >= 0) {
        self.workers.splice(i, 1);
        console.log('Worker removed!'.yellow);
      }
    }

    self.emit('workerConnected');
  }
};

sys.inherits(Station, events.EventEmitter);


Station.prototype.start = function() {
  this.server.listen(this.port, function() {
    console.log('Station listening!'.green);
  });
};


module.exports = Station;
