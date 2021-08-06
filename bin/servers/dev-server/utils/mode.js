const path = require('path')
const { fse } = require('@qnpm/ykit3-shared-utils')
const { MODE_NAMES, CONFIG_FILE_NAME } = require('./constants')

/**
 *
 * 产生modeInfo的factory
 * @param {*} modeName
 * @param {*} infos
 */
const modeInfoFactory = (modeName, infos = {}) => {
    switch (modeName) {
    case MODE_NAMES.SINGLE:
        return {
            modeName: MODE_NAMES.SINGLE
        }
    case MODE_NAMES.MULTIPLE:
        return {
            modeName: MODE_NAMES.MULTIPLE,
            projects: infos.projects
        }
    case MODE_NAMES.OTHER:
    default:
        return {
            modeName: MODE_NAMES.OTHER
        }
    }
}

/**
 *
 * 解析启动模式
 * @param {*} curDir
 */
function resolveStartModeInfo (curDir) {
    if (fse.existsSync(path.resolve(curDir, CONFIG_FILE_NAME))) {
        return modeInfoFactory(MODE_NAMES.SINGLE)
    } else {
        const projects = []
        fse.readdirSync(curDir).filter(item => {
            const subDirPath = path.resolve(curDir, item)
            if (fse.statSync(subDirPath).isDirectory()) {
                if (fse.existsSync(path.resolve(subDirPath, CONFIG_FILE_NAME))) {
                    projects.push(path.resolve(subDirPath))
                }
            }
        })
        return modeInfoFactory(projects.length ? MODE_NAMES.MULTIPLE : MODE_NAMES.OTHER, projects.length ? { projects } : void 0)
    }
}

const getFile = (compiler,url) => {
    return new Promise(function(resolve, reject) {
        compiler.outputFileSystem.readFile(
            url,
            (err, result) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(result);
                }
            }
        );
    });
}


module.exports = {
    resolveStartModeInfo,
    getFile
}
