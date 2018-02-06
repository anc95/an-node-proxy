import http from 'http'
import https from 'https'
import {resolve} from 'path'
import {statSync} from 'fs'
import {excuteFunc} from './common'

export default function(req, res, options, server) {
    const mockFilename = matchMock(req, options)
    console.log(mockFilename)
    if (!mockFilename && options.target) {
        proxyRequest(req, res, options, server)
    } else if (mockFilename && statSync(mockFilename).isFile()) {
        const responseJson = require(mockFilename) || require(mockFilename).default
        res.setHeader('Content-type', 'Application/json')
        res.write(JSON.stringify(responseJson))
        res.end()
    } else {
        res.writeHead(404, {'Content-type': 'text/html; charset=gbk'})
        res.end(`options target未指定且${mockFilename}不存在`)
    }

    function matchMock(req, options) {
        const relUrl = req.url
        const mock = options.mock
        let mockJsonLoc = false
        if (mock && mock.rules && mock.rules !== 0) {
            mock.rules.every(rule => {
                const from = rule.from
                if (relUrl.indexOf(from) === 0) {
                    mockJsonLoc = rule.to + relUrl.substring(rule.from.length, relUrl.length)
                    return false
                }

                return true
            })
        }
        return mockJsonLoc ? resolve(mock.base, mockJsonLoc) : false
    }

    function proxyRequest(req, res, options, server) {
        const requestOptions = parseRequestOptions(req, options)
        const request = requestOptions.protocol === 'https:' ? https.request : http.request
        const proxyReq = request(requestOptions, proxyRes => {
            // proxyRes.on('end', () => {
            //     res.end()
            // });
            server.emit('proxyRes', {res, req, proxyRes, options})
            excuteFunc(options.before, proxyRes, res, )
            writeHeaders(res, proxyRes)
            proxyRes.pipe(res)
        })

        proxyReq.on('error', errorHandler)

        req.on('error', errorHandler)

        proxyReq.end()
    }

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

    function writeHeaders(res, proxyRes) {
        for (let [key, header] of Object.entries(proxyRes.headers)) {
            res.setHeader(key, header)
        }

        const {statusCode, statusMessage} = proxyRes
        res.writeHead(statusCode, statusMessage)
    }
}