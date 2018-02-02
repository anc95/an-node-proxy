import {createServer} from 'http'
import {URL} from 'url'
import handleInCommingMsg from './incomming'
import EventEmitter from 'events'

export default class HttpProxy extends EventEmitter{
    constructor(options) {
        super()
        this.options = options
        if (options) {
            this.server = createServer((req, res) => {
                this.req = req
                this.res = res
            })

            this.proxy(req, res, options, this)
        }
    }

    adaptTarget(options) {
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

    //供中间件使用的代理函数
    proxy(req, res, options) {
        this.adaptTarget(options)
        handleInCommingMsg(req, res, options, this)
    }

    listen(port) {
        this.server.listen(port)
        return this
    }
}