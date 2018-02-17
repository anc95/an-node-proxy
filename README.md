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
import http from 'http'
import {createProxyServer} from 'an-node-proxy'

const proxy = createProxyServer({
  target:'http://localhost:8002'
}).listen(8001);

http.createServer(function (req, res) {
  res.write('from 8002')
  res.end();
}).listen(8002);
```
so does https, `an-node-proxy` also support
### middileware
```js
import express from 'express'
import {join as pathjoin} from 'path'
import {createProxy} from 'an-node-proxy'

const app = new express()
const proxy = createProxy()

app.use((req, res, next) => {
    proxy.proxy(req, res, {
        target: 'http://www.baidu.com'
    })

    next()
})

app.listen(8000)
```
### mock
```js
import http from 'http'
import {join as pathjoin} from 'path'

http.createServer(function (req, res) {
  proxy.proxy(req, res, {
    mock: {
      base: pathJoin(__dirname, 'mock'),
      rules: [{
        from: '/test/',
        to: './'
      }]
    }
  });
}).listen(8009);
```
