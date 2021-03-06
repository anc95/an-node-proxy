# an-node-proxy

`an-node-proxy` is an http proxying library, supports both http and https, and also supports proxy to local data with the need of mock request

## Features
- [x] http proxy
- [x] https proxy
- [x] mock
- [ ] more headers, au and so on
- [ ] improve readme
- [ ] an tool to produce index

## Installation
npm install an-node-proxy --save

## Ussage
### http proxy
```js
import {createServer} from 'http'
import {createProxyServer} from 'an-node=proxy'

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
```
so does https, `an-node-proxy` also support
### middileware
```js
import express from 'express'
import {createServer} from 'http'
import {createProxy} from 'an-node-proxy'

const app = new express()
const proxy = createProxy({
    target: 'http://localhost:8004'
})

app.use((req, res) => {
    proxy.proxy(req, res)
})

app.listen(8003)

// target server
createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.write(`request from ${req.socket.localAddress}, and headers are ${JSON.stringify(req.headers, null, 2)}`)
    res.end()
}).listen(8004)
```
### mock
```js
import {createServer} from 'http'
import {createProxyServer} from 'an-node-proxy'

// mock server
createProxyServer({
  mock: {
      rules: [
          {
              from: '/test',
              to: './examples/mock'
          },
          {
              from: '/test/a.js',
              to: './examples/a.js'
          }
      ]
  }
}).listen(8005)
```
