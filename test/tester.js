require('colors');

var duplexEmitter = require('duplex-emitter'),
  events = require('events'),
  sys = require('sys'),
  net = require('net');


var duplexEmitter = require('duplex-emitter'),
  sys = require('sys'),
  Command = require('./command');

var Tester = function(type) {
  var self = this;

  this.socket = net.connect({port: process.env.BALANCER_PORT || 5000, host: process.env.BALANCER_HOST || '127.0.0.1'}, function() {
    console.log('Connected to dispatcher'.green);
  });

  this.remote = duplexEmitter(this.socket);

  this.remote.emit('init', type);

  this.remote.on('ready', function() {
    self.emit('ready');
  });
};

sys.inherits(Tester, events.EventEmitter);

Tester.prototype.spawn = function(command, args, env) {
  return new Command(this.remote, command, args, env);
};

module.exports = Tester;

