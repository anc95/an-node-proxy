import {request, createServer} from 'http'
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

    parseRquestOptions(req, res, options) {
        const {host, hostname, port, protocol} = new URL(options.target)
        const headers = req.headers
        return Object.assign({host, hostname, port, protocol}, {headers})
    }

    //供中间件使用的代理函数
    proxy(req, res, options) {
        const requestOptions = this.parseRquestOptions(req, res, options)
        handleInCommingMsg(req, res, requestOptions, this)
    }

    listen(port) {
        this.server.listen(port)
        return this
    }
}