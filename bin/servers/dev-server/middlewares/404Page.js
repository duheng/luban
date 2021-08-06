const { MODE_NAMES } = require('../utils/constants')
const path = require('path')
const chalk = require('chalk');
const { printLog } = require('../../../utils/base')

module.exports = async (ctx) => {
    ctx.res.statusCode = 404
    printLog({type: 'error',text:   chalk.red('404' + ctx.req.url + ' 没找到对应资源')})
    switch (ctx.modeInfo.modeName) {
    case MODE_NAMES.SINGLE:
        await ctx.render('404-single', {
            url: ctx.request.url,
            modeInfo: ctx.modeInfo,
            compiledAssetsNames: ctx.compiledAssetsNames,
            dllAssets: ctx.dllAssets
        })
        break
    case MODE_NAMES.MULTIPLE:
        const projects = ctx.modeInfo.projects && ctx.modeInfo.projects.map(item => item.split(path.sep).pop())
        await ctx.render('404-multiple', {
            url: ctx.request.url,
            modeInfo: ctx.modeInfo,
            projectName: ctx.projectName,
            projects: projects,
            compiledAssetsNames: ctx.compiledAssetsNames,
            dllAssets: ctx.dllAssets
        })
        break
    default:
        await ctx.render('404', {
            url: ctx.request.url,
            modeInfo: ctx.modeInfo
        })
    }
}
