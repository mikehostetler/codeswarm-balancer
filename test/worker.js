require('colors');

var net           = require('net'),
  DuplexEmitter = require('duplex-emitter'),
  reconnect     = require('reconnect');


reconnect(function (socket) {
  console.log('Connected to balancer'.green);

  var remote = DuplexEmitter(socket);

  remote.on('spawn', function(data) {
    console.log('Received a spawn'.green);
    remote.emit('stdout', 'utopia');
    remote.emit('stderr', 'dang big nasty error');
  });

  remote.on('init', function(data) {
    console.log('Received a init'.green);
  });

  socket.once('end', onEnd);
  socket.on('error', onEnd);

  function onEnd() {
    console.log('Disconnected from balancer.'.red);
  }
}).connect(5005, '127.0.0.1');