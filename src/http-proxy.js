import {createServer} from 'http'
import {URL} from 'url'
import handleInCommingMsg from './incomming'
import EventEmitter from 'events'

export default class HttpProxy extends EventEmitter{
    constructor(options, server) {
        super()
        this.options = options
        if (server) {
            this.server = createServer((req, res) => {
                this.req = req
                this.res = res
            })

            this.proxy(req, res, options, this)
        }
    }

    adaptTarget(options) {
        if (!options.target) {
            return
        }

        let target = {
            host: '',
            hostname: '',
            port: '80',
            path: '/',
            protocol: 'http:'
        }
        let urlInfo = typeof options.target === 'string' ? new URL(options.target) : options.target

        for (const key of Object.keys(target)) {
            target[key] = urlInfo[key]
        }
        
        options.target = target
    }

    adaptMock(options) {
        if (!options.mock) {
            return;
        }

        const mock = options.mock
        const base = mock.base || process.cwd()
        const rules = mock.rules
        
        rules.forEach(rule => {
            rule.from = this.ensureUrlPrefix(rule.from)
            rule.to = this.ensureUrlPrefix(rule.to)
        })

        rules.sort((a, b) => a.from.split('/').length - b.from.split('/'))

        options.rules = {base, rules}
    }

    ensureUrlPrefix(url) {
        if (url.indexOf('/') !== 0 && url.indexOf('.') !== 0) {
            url = `/${url}`
        }
        return url
    }

    //供中间件使用的代理函数
    proxy(req, res, options) {
        handleInCommingMsg(req, res, options, this)
    }

    listen(port) {
        this.server.listen(port)
        return this
    }
}