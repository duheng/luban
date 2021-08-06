const BaseMode = require('./BaseMode')
const path = require('path')
const { lodash: _, printLink, chalk } = require('@qnpm/ykit3-shared-utils')

function resolveModulePath (searchPath, requirePath) {
    let res
    try {
        try {
            res = require.resolve(path.join(searchPath, requirePath))
        } catch (e) {
            res = require.resolve(path.join(searchPath, 'node_modules', requirePath))
        }
    } catch (e) {
        throw new Error(chalk`${printLink(searchPath, 'gray')} {red 下找不到入口模块:{yellow ${requirePath}} }`)
    }
    return res
}

module.exports = class SingleMode extends BaseMode {
    logModeInfo () {
        super.logModeInfo()
        const { logger, curDir, utils: { chalk } } = this
        this.appName = curDir.split(path.sep).pop()
        logger.info('工程名:', chalk.yellow(this.appName))
    }

    resolveProjectName () {
    }

    resolveProjectRootDir () {
        return this.curDir
    }

    isProjectName () {
        this.logger.info('工程地址:', this.curDir)
        return true
    }

    handleOutputConfig (output) {
    }

    resolveWebpackEntry (entryItem) {
        if (_.isArray(entryItem)) {
            return entryItem.map(item => resolveModulePath(path.join(this.curDir, this.projectName || ''), item))
        }
        return resolveModulePath(path.join(this.curDir, this.projectName || ''), entryItem)
    }
}
