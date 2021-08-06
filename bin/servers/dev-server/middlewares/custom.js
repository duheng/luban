

module.exports = (curDir) => async (ctx, next) => {
    if(global.customMid) {
        global.customMid(ctx, next)
    } else {
        await next()
    }
}
