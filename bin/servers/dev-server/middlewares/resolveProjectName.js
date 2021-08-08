const url = require('url')
const chalk = require('chalk');

module.exports = async (ctx, next) => {
  
    ctx.printLog({text:'------------------------------'})
    ctx.requestUrl = url.parse(ctx.request.url)
    ctx.printLog({text:'请求的url:'+ chalk.yellow(ctx.request.url)})
    const projectName = ctx.mode.resolveProjectName(ctx.requestUrl)
    if (projectName) {
        global.projectName = ctx.projectName = projectName
    }
    const { config } = require('../../../utils/common')
    if(config && Object.keys(config).length > 0) {
        global.devServerconfig = config
        await next()
    }
  
}
