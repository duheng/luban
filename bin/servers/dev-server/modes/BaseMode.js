const path = require('path')
const fs = require('fs')
const NoImplementionError = require('../errors/NoImplementionError')
const chalk = require('chalk');
const { printLog } = require('../../../utils/base')


/**
 * 启动模式的状态类（状态模式）
 * 不同模式封装不同的操作，使用者通过切换模式的实现类来切换模式
 */
module.exports = class BaseMode {
    constructor ({ logger, curDir, modeInfo }) {
        this.logger = logger
        this.curDir = curDir
        this.modeInfo = modeInfo
        this.utils = {
            chalk,
            fs
        }
        if (this.modeInfo.projects && this.modeInfo.projects.length) {
            this.projectNames = this.modeInfo.projects.map(item => item.split(path.sep).pop())
        }
    }

    /**
     * 打印当前模式的信息
     */
    logModeInfo () {
        printLog({text: '启动模式:'+ chalk.yellow(this.modeInfo.modeName === 'multiple' ? '多工程模式(multiple)' : '单工程模式(single)')})
    }

    resolveProjectRootDir () {
        throw new NoImplementionError()
    }

    resolveProjectName () {
        throw new NoImplementionError()
    }

    isProjectName () {
        throw new NoImplementionError()
    }

    handleOutputConfig () {
        throw new NoImplementionError()
    }

    resolveWebpackEntry () {
        throw new NoImplementionError()
    }
}
