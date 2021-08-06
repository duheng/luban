
module.exports = async (ctx, next) => {
    if (ctx.hotMiddleware) {
        await ctx.hotMiddleware(ctx.req, ctx.res, next)
    } else {
        await next()
    }
}
