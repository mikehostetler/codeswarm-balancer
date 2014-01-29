require('colors');

var events = require('events'),
  sys = require('sys'),
  stream = require('stream');


var Command = function(remote, command, args, env) {
  var self = this;

  this.stdout = new stream.PassThrough();
  this.stderr = new stream.PassThrough();
  this.remote = remote;

  remote.on('done', function(code) {
    self.emit('close', code);
  });

  remote.on('stdout', function(data) {
    self.stdout.write(data);
  });

  remote.on('stderr', function(data) {
    self.stderr.write(data);
  });

  remote.emit('spawn', command, args, env);
};


sys.inherits(Command, events.EventEmitter);

module.exports = Command;
