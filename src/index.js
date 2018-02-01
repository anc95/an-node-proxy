import HttpProxy from './http-proxy'

export function createServer (options) {
    return new HttpProxy(options)
}

export function createProxyServer() {
    return new HttpProxy()
}

