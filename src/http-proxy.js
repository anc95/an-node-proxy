import {request, createServer} from 'http'
import {URL} from 'url'

export default class HttpProxy {
    constructor(options) {
        this.target = options.target
        this.server = createServer((req, res) => {
            const urlInfo = new URL(this.target)
            const {host, hostname, port, protocol} = urlInfo
            const proxyReq = request({host, hostname, port, protocol}, proxyRes => {
                res.writeHead(200, proxyRes.headers)

                proxyRes.setEncoding('utf8');
                proxyRes.on('data', chunk => {
                    res.write(chunk)
                });

                proxyRes.on('end', () => {
                    res.end()
                });
            })

            proxyReq.on('error', e => {
                console.log(`proxy error: ${e.message}`)
            })

            proxyReq.end()
        })
    }

    listen(port) {
        this.server.listen(port)
        return this
    }
}