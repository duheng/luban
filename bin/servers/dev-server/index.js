const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const favicon = require('koa-favicon')
const views = require('koa-views')
const { printLog } = require('../../utils/base')
const chalk = require('chalk');

const page404 = require('./middlewares/404Page')
const ctxFill = require('./middlewares/ctxFill')
const resolveProjectName = require('./middlewares/resolveProjectName')
const webpackDevServer = require('./middlewares/webpackDevServer')
const webpackHotModuleReplacement = require('./middlewares/webpackHotModuleReplacement')
const custom = require('./middlewares/custom')
const myStatic = require('./middlewares/myStatic')
const fileRes = require('./middlewares/fileRes')
//const autoCheck = require('./middlewares/autoCheck')
const { resolveStartModeInfo } = require('./utils/mode')
const modeFactory = require('./modes/modeFactory')

function createDevServer ({ curDir, modeInfo, mode, options }) {
    // 启动服务器
    const app = new Koa()
    app.use(favicon(path.resolve(__dirname, './favicon.ico')))
    app.use(ctxFill({ modeInfo, mode, printLog, curDir }))// 填充 ctx
    app.use(resolveProjectName)// 解析工程名
   // app.use(autoCheck({ modeInfo, mode, printLog, curDir })) // 依赖检查
    app.use(fileRes(modeInfo))
    app.use(webpackDevServer(!!options.hot, options.port || 8888))
    app.use(webpackHotModuleReplacement)
    app.use(myStatic(curDir))
    app.use(custom(curDir))
    app.use(views(path.join(__dirname, './middlewares/views'), {
        extension: 'ejs'
    }))

    app.use(page404)// 404页面

    return {
        start: (port = 8888) => {
            app.listen(port, () => {
                const link = `http://localhost:${port}/`
                printLog({text:`本地目录:${process.cwd()}`})
                printLog({text:`开发服务器启动在: ${chalk.yellow(link)}`})
                // logger.info('本地目录:', process.cwd())
               // logger.info(`开发服务器启动在: ${printLink(link, 'cyan')}`)

               
            })
        }
    }
}

/**
 * 获取启动模式信息
 */
function resolveStartMode () {
    const curDir = process.cwd()
    const modeInfo = resolveStartModeInfo(curDir)

    const mode = modeFactory(modeInfo.modeName, {
        printLog,
        curDir,
        modeInfo
    })

    return {
        mode,
        modeInfo
    }
}
process.on('uncaughtException', (msg) => {
    if (msg && msg.toString().indexOf('address already in use') > -1) {
        const port = /address already in use [^\d]+(\d+)/.exec(msg)[1]
        printLog({type: 'error',text: port + ' 端口已被占用，请使用 -p 指定其他端口'})
    } else {
        throw msg
    }
})

module.exports = async function (options) {
    // 获取启动模式信息
    const { modeInfo, mode } = resolveStartMode()
    mode.logModeInfo()
    // 启动开发服务器
    createDevServer({ curDir: process.cwd(), modeInfo, mode, options }).start(options.port || 8888)
}
