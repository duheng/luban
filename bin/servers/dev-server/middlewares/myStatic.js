
const koaStatic = require('koa-static')

module.exports = (curDir) => async (ctx, next) => {
    if (ctx.req.url === '/' || (ctx.req.url.replace('/', '') === ctx.projectName && ctx.projectName.replace('/', ''))) {
        await next()
    } else {
        await koaStatic(curDir)(ctx, next)
    }
}
