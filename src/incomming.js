import http from 'http'
import https from 'https'

export default function(req, res, options, server) {
    const requestOptions = parseRequestOptions(req, options)
    const request = requestOptions.protocol === 'https:' ? https.request : http.request
    const proxyReq = request(requestOptions, proxyRes => {
        proxyRes.on('end', () => {
            server.emit('proxyRes', {res: proxyRes})
            res.end()
        });

        for (let [key, header] of Object.entries(proxyRes.headers)) {
            res.setHeader(key, header)
        }

        proxyRes.pipe(res)
    })

    proxyReq.on('error', errorHandler)

    req.on('error', errorHandler)

    proxyReq.end()

    function errorHandler(e) {
        server.emit('error', e, req, res)
    }

    function parseRequestOptions(req, options) {
        let path = req.url
        let {host, hostname, protocol, port} = options.target
        let {method, headers} = req
        headers.host = hostname
        return Object.assign({}, {host, hostname, protocol, port, path}, {method, headers})
    }
}