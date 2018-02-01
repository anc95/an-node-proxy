import http from 'http'
import https from 'https'

export default function(req, res, requestOptions, server) {
    const request = requestOptions.protocol === 'https:' ? https.request : http.request
    const proxyReq = request(requestOptions, proxyRes => {
        proxyRes.on('end', () => {
            server.emit('proxyRes', {res: proxyRes})
            res.end()
        });

        proxyRes.pipe(res)
    })

    proxyReq.on('error', errorHandler)

    req.on('error', errorHandler)

    proxyReq.end()

    function errorHandler(e) {
        server.emit('error', e, req, res)
    }
}