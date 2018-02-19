import {createServer} from 'http'
import {createProxyServer} from '../src'

// proxy server
createProxyServer({
  target: 'http://localhost:8001'
}).listen(8000)

// target server
createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.write(`request from ${req.socket.localAddress}, and headers are ${JSON.stringify(req.headers, null, 2)}`)
  res.end()
}).listen(8001)