export function excuteFunc(fn, ...args) {
    if (typeof fn === 'function') {
        return fn(args)
    }
}