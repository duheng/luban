module.exports = ({ modeInfo, mode, curDir, printLog }) => async (ctx, next) => {
    ctx.curDir = curDir
    ctx.printLog = printLog
    ctx.modeInfo = modeInfo
    ctx.mode = mode
    await next()
}
