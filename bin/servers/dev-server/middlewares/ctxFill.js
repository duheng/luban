module.exports = ({ modeInfo, mode, curDir, logger }) => async (ctx, next) => {
    ctx.curDir = curDir
    ctx.logger = logger
    ctx.modeInfo = modeInfo
    ctx.mode = mode
    await next()
}
