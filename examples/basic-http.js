var colors = require('colors'),
    http = require('http'),
    httpProxy = require('../src');

//
// Basic Http Proxy Server
//
var proxy = httpProxy.createProxy({
  target:'http://localhost:9003'
}).listen(8003);
//
// Target Http Server
//
http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2));
  res.end();
}).listen(9003);

console.log('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + '8003'.yellow);
console.log('http server '.blue + 'started '.green.bold + 'on port '.blue + '9003 '.yellow);
