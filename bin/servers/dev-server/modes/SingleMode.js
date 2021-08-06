const BaseMode = require('./BaseMode')
const path = require('path')
const chalk = require('chalk');
const { printLog } = require('../../../utils/base')

function resolveModulePath (searchPath, requirePath) {
    let res
    try {
        try {
            res = require.resolve(path.join(searchPath, requirePath))
        } catch (e) {
            res = require.resolve(path.join(searchPath, 'node_modules', requirePath))
        }
    } catch (e) {
        throw new Error(chalk`${chalk.gray(searchPath)} {red 下找不到入口模块:{yellow ${requirePath}} }`)
    }
    return res
}

module.exports = class SingleMode extends BaseMode {
    logModeInfo () {
        super.logModeInfo()
        const { logger, curDir, utils: { chalk } } = this
        this.appName = curDir.split(path.sep).pop()
        printLog({text: '工程名:'+ chalk.yellow(this.appName)})
    }

    resolveProjectName () {
    }

    resolveProjectRootDir () {
        return this.curDir
    }

    isProjectName () {
        printLog({text: '工程地址:'+ chalk.yellow(this.curDir)})
        return true
    }

    handleOutputConfig (output) {
    }

    resolveWebpackEntry (entryItem) {
        if (Array.isArray(entryItem)) {
            return entryItem.map(item => resolveModulePath(path.join(this.curDir, this.projectName || ''), item))
        }
        return resolveModulePath(path.join(this.curDir, this.projectName || ''), entryItem)
    }
}
