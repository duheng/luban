const { axios, chalk } = require('@qnpm/ykit3-shared-utils')
const configResolver = require('@qnpm/ykit3-config-resolver')

const URL = 'http://gitlab.corp.qunar.com/corpfe/ykit3-dll-library/raw/release/library.json'

const formatJsonData = (data)=> {
    let __data = []
    for(let i of Object.keys(data)){
        __data.push(data[i])
    }
    return  [].concat.apply([], __data)
}

const getOriginLibrary = () => {
    const config = {
        url: URL,
        method: 'get', 
        timeout: 100
    }
   return axios(config).then(res=>{
        const { status, data } = res
        if(status == 200) {
            return formatJsonData(data)
        } else {
            return []
        }
    }).catch((error)=> {
        return []
    })
}

const getPackageDes = (rootDir)=> {
    const pkg = require(`${rootDir}/package.json`)
    if(pkg) {
       return Object.keys(pkg.dependencies)
    }
    return []
}

const getYkit3ConfigDll = (rootDir)=> {
    const { dllConfig = {} } = configResolver(rootDir)
    if(dllConfig.lib) {
        return formatJsonData(dllConfig.lib)
    }
    return []
}

const getDiffPkgAndDll = (source, dist) => {
    let __data = []
    for(let item of source) {
        if(!dist.includes(item)) {
            __data.push(item)
        }
    }
    return __data
}

const getDiffLocalAndOrigin = (source, dist) => {
    let __data = []
    for(let item of source) {
        if(dist.includes(item)) {
            __data.push(item)
        }
    }
    return __data
}
let flagAutoCheck = true
 // 自动监测packge.json中是否有需要添加到dll中的包
module.exports = ({ modeInfo, mode, curDir, logger }) => async (ctx, next) => {
    if(flagAutoCheck) {
        flagAutoCheck = false
        process.nextTick(async _=>{
            const rootDir = mode.resolveProjectRootDir(ctx.projectName)
            const ykit3ConfigDll = getYkit3ConfigDll(rootDir)
            if(ykit3ConfigDll.length > 0) {
                const library = await getOriginLibrary()
                const packageDes = getPackageDes(rootDir)
                const diffPkgAndDll = getDiffPkgAndDll(packageDes, ykit3ConfigDll) // package.json中有但dll中没配置的包
                const diffDllAndPkg = getDiffPkgAndDll(ykit3ConfigDll, packageDes) // dll中有但package.json中没有的包
                const diffLocalAndOrigin =  getDiffLocalAndOrigin(diffPkgAndDll, library) // 本地库和远程库进行对比，如果存在则提示加入到dll
                diffLocalAndOrigin.length > 0 && logger.warn(chalk`{red 🔧 检测到以下 ${diffLocalAndOrigin.length} 个库没有添加到dll配置, 添加后可提升加载和构建效率, 如已确认请忽略该提示:}\n`, diffLocalAndOrigin)
                diffDllAndPkg.length > 0 && logger.warn(chalk`{red 🔧 检测到ykit3.config.js中配置了以下 ${diffDllAndPkg.length} 个库，但package.json不存在此库，请确认，如已确认请忽略该提示:}\n`, diffDllAndPkg)
            } 
        })
        await next()
    } else {
        await next()
    }
}
