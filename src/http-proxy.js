import {createServer} from 'http'
import {URL} from 'url'
import handleInCommingMsg from './incomming'
import EventEmitter from 'events'

export default class HttpProxy extends EventEmitter{
    constructor(option, server) {
        super()
        this.option = this.adaptMock(option)
        if (server) {
            this.server = createServer((req, res) => {
                this.req = req
                this.res = res

                this.proxy(req, res, option, this)
            })
        }
    }

    adaptoption(option) {
        if (!option.target) {

        }

        this.adaptMock(option)
        this.adaptTarget(option)

        return option
    }

    adaptTarget(option) {
        if (!option.target) {
            return
        }

        let target = {
            host: '',
            hostname: '',
            port: '80',
            path: '/',
            protocol: 'http:'
        }
        let urlInfo = typeof option.target === 'string' ? new URL(option.target) : option.target

        for (const key of Object.keys(target)) {
            target[key] = urlInfo[key]
        }
        
        option.target = target
    }

    adaptMock(option) {
        if (!option.mock) {
            return;
        }

        const mock = option.mock
        const base = mock.base || process.cwd()
        const rules = mock.rules
        
        rules.forEach(rule => {
            rule.from = this.ensureUrlPrefix(rule.from)
            rule.to = this.ensureUrlPrefix(rule.to)
        })

        rules.sort((a, b) => a.from.split('/').length - b.from.split('/'))

        option.rules = {base, rules}
    }

    ensureUrlPrefix(url) {
        if (url.indexOf('/') !== 0 && url.indexOf('.') !== 0) {
            url = `/${url}`
        }
        return url
    }

    //供中间件使用的代理函数
    proxy(req, res, option) {
        if (option) {
            this.adaptoption(option)
        }
        handleInCommingMsg(req, res, option, this)
    }

    listen(port) {
        this.server.listen(port, e => {
            if (e) {
                return console.error(e)
            }

            console.log(`proxy server is on http://localhost:${port}`)
        })
        return this
    }
}