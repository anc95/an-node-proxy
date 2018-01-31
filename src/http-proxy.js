import {request, createServer} from 'http'
import {URL} from 'url'
import handleInCommingMsg from './incomming'
import EventEmitter from 'events'

export default class HttpProxy extends EventEmitter{
    constructor(options) {
        super()
        this.options = options
        this.server = createServer((req, res) => {
            this.req = req
            this.res = res

            const requestOptions = this.parseRquestOptions()
            handleInCommingMsg(req, res, requestOptions, this)
        })
    }

    parseRquestOptions() {
        const {host, hostname, port, protocol} = new URL(this.options.target)
        const headers = this.req.headers
        return Object.assign({host, hostname, port, protocol}, {headers})
    }

    listen(port) {
        this.server.listen(port)
        return this
    }
}