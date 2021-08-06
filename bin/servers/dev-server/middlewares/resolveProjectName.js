const url = require('url')
const { chalk } = require('@qnpm/ykit3-shared-utils')

module.exports = async (ctx, next) => {
    ctx.logger.info('------------------------------')
    ctx.requestUrl = url.parse(ctx.request.url)
    ctx.logger.info('请求的url:', chalk.yellow(ctx.request.url))
    const projectName = ctx.mode.resolveProjectName(ctx.requestUrl)
    if (projectName) {
        global.projectName = ctx.projectName = projectName
    }

    await next()
}
