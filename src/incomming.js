import http from 'http'
import https from 'https'
import {resolve} from 'path'
import {statSync} from 'fs'
import {excuteFunc} from './common'
import {hostname} from 'os'

function matchMock(req, option) {
    const relUrl = req.url
    const mock = option.mock
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

function proxyRequest(req, res, option, server) {
    const requestOption = parseRequestOption(req, option)
    const request = requestOption.protocol === 'https:' ? https.request : http.request

    const proxyReq = request(requestOption, proxyRes => {
        server.emit('proxyRes', {res, req, proxyRes, option})
        writeHeaders(res, proxyRes)
        proxyRes.pipe(res)
    })

    proxyReq.on('error', e => {
        if (e.code === 'ETIMEDOUT') {
            console.error(e.message)
        }
        server.emit('error', {e, req, res})
    })

    req.on('error', e => {
        console.log(e)
    })

    proxyReq.end()
}

function parseRequestOption(req, option) {
    let path = req.url
    let {host, hostname, protocol, port} = option.target
    let {headers, method} = req
    headers.host = hostname
    
    if (option.headers) {
        headers = Object.assign({}, headers, option.headers)
    }

    if (option.method) {
        method = option.method
    }

    return Object.assign({}, {host, hostname, protocol, port, path}, {method, headers})
}

function writeHeaders(res, proxyRes) {
    for (let [key, header] of Object.entries(proxyRes.headers)) {
        res.setHeader(key, header)
    }

    const {statusCode, statusMessage} = proxyRes
    res.writeHead(statusCode, statusMessage)
}

export default function(req, res, option, server) {
    const mockFilename = matchMock(req, option)

    if (!mockFilename && option.target) {
        return proxyRequest(req, res, option, server)
    } else if (mockFilename) {
        let responseJson = null
        try {
            responseJson = require(mockFilename) || require(mockFilename).default
        } catch (e) {
            responseJson = `mock file dest: ${mockFilename} is not exsited`
            console.error(responseJson)
        }

        res.setHeader('Content-type', 'Application/json')
        res.write(JSON.stringify(responseJson))
        return res.end()
    }

    res.writeHead(404, {'Content-type': 'text/html; charset=utf-8'})
    res.end(`option.target is expected a url but got ${option.target}`)
}