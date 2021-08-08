module.exports = ({ modeInfo, mode, curDir, printLog }) => async (ctx, next) => {
    process.env.NODE_ENV = 'development'
    ctx.curDir = curDir
    ctx.printLog = printLog
    ctx.modeInfo = modeInfo
    ctx.mode = mode
    await next()
}
