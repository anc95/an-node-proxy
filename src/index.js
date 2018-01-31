import HttpProxy from './http-proxy'

export function createProxy (options) {
    return new HttpProxy(options)
}