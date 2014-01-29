var Tester = require('./tester');

var tester = new Tester('nodejs');

tester.on('ready', function () {
  var uptime = tester.spawn('uptime', {}, {}, 'nodejs');

  uptime.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });

  uptime.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });

  uptime.on('close', function (code) {
    console.log('command finished with code ' + code);
    process.exit(code);
  });
});
