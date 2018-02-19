import HttpProxy from './http-proxy'
/**
 * option = {
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
export function createProxyServer (option) {
    return new HttpProxy(option, true)
}

export function createProxy(option) {
    return new HttpProxy(option, false)
}

