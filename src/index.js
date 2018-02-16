import HttpProxy from './http-proxy'
/**
 * options = {
 *     target: string, target url,
 *     headers: [{key: value}, {key, value}],  //headers will be assigned to requestHeaders
 *     mock: {
 *          base: string,  //local base dir, default to cwd
 *          rules: [{
 *              from: string, // mock from, such as, '/test/',
 *              to: string, // mock to, such as, '/dest/'      //when this rule works, the '/test/a.js' will be proxyed to `${base}/dest/a.js`
 *          }, ...]
 *     }
 * } 
 */
export function createServer (options) {
    return new HttpProxy(options, true)
}

export function createProxy(options) {
    return new HttpProxy(options, false)
}

