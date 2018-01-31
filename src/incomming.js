import {request} from 'http'

export default function(req, res, requestOptions, server) {
    const proxyReq = request(requestOptions, proxyRes => {
        res.writeHead(200, proxyRes.headers)

        proxyRes.setEncoding('utf8');
        proxyRes.on('data', chunk => {
            res.write(chunk)
        });

        proxyRes.on('end', () => {
            res.end()
        });
    })

    proxyReq.on('error', errorHandler)

    req.on('error', errorHandler)

    proxyReq.end()

    function errorHandler(e) {
        server.emit('error', e, req, res)
    }
}