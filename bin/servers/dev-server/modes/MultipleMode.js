const BaseMode = require('./BaseMode')
const path = require('path')
const { REGEX_PATTERN: { URL_PROJECT_NAME } } = require('../utils/constants')
const chalk = require('chalk');
const { printLog } = require('../../../utils/base')

function isProjectNameInclude (projects, projectName) {
    return projects.some(item => item.slice(-projectName.length) === projectName)
}

function resolveModulePath (searchPath, requirePath) {
    let res
    try {
        try {
            res = require.resolve(path.join(searchPath, requirePath))
        } catch (e) {
            res = require.resolve(path.join(searchPath, 'node_modules', requirePath))
        }
    } catch (e) {
        throw new Error(chalk`${chalk.yellow(searchPath)} {red 下找不到入口模块:{yellow ${JSON.stringify(requirePath)}} }`)
    }
    return res
}

module.exports = class MultipleMode extends BaseMode {
    logModeInfo () {
        super.logModeInfo()
        const { logger, utils: { chalk } } = this
        printLog({text: '工程列表:'+ chalk.yellow(this.projectNames)})
    }

    resolveProjectRootDir (projectName) {
        return path.join(this.curDir, projectName || '')
    }

    resolveProjectName (requestUrl) {
        let projectName
        const { logger, utils: { chalk } } = this
        const possibleProjectName = requestUrl.path.includes('/') ? URL_PROJECT_NAME.exec(requestUrl.path)[1] : ''

        if (this.modeInfo.projects && isProjectNameInclude(this.projectNames, possibleProjectName)) {
            projectName = possibleProjectName
        }
        if (projectName) {
            this.projectName = projectName
            printLog({text: '请求的工程名:'+ chalk.yellow(projectName)})
            return projectName
        }
        return ''
    }

    isProjectName (projectName) {
        const { curDir, logger } = this
        const projectPath = path.join(curDir, projectName || '')
        if (isProjectNameInclude(this.projectNames, projectName)) {
            printLog({text: '工程地址:'+ chalk.yellow(projectPath)})
            return true
        }
        return false
    }

    handleOutputConfig (output, port) {
        output.publicPath = 'http://127.0.0.1:' + port + '/' + path.join(this.projectName) + '/'
        // output.publicPath = path.join(this.projectName, output.publicPath)
    }

    resolveWebpackEntry (entryItem) {
        if (Array.isArray(entryItem)) {
            return entryItem.map(item => resolveModulePath(path.join(this.curDir, this.projectName), item))
        }
        return resolveModulePath(path.join(this.curDir, this.projectName), entryItem)
    }
}
