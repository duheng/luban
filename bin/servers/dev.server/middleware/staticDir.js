
const koaStatic = require('koa-static')

module.exports = (curDir) => {
    return async (ctx, next) => {
        await koaStatic(curDir)
   }
}