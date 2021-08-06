const path = require('path')
const fs = require('fs')
const { chalk, shell, fse, lodash: _, globby } = require('@qnpm/ykit3-shared-utils')
const configResolver = require('@qnpm/ykit3-config-resolver')
const { MODE_NAMES, WEBPACK_HMR_URL, HOT_HEART_BEAT_INTERVAL } = require('../utils/constants')
const { generateDllWebpackConfig, generateDllReferencePlugins } = require('../../../utils/webpackConfig')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const { isChangeDll, setDllVersion } = require('../../../utils/dllpitch')
const { webpackStatsFormatter } = require('../../../utils/print')

const { match } = require('assert')
const CWD = process.cwd()
function transformRequestUrlHash (url) {
    return url.replace(/@[^.]*\./, '@dev.')
}

function transformRequestUrProjectName (url, projectName) {
    if (url.includes('__webpack_hmr')) {
        return url
    }
    return url.replace(projectName, '')
}

function transformRequestUrlPublicPath (url) {
    // return url
    const __splitUrl =  url.split('/prd')
    const resUrl = __splitUrl.length > 1 ? __splitUrl[1] : __splitUrl[0]
    return resUrl.replace(/[\/]+/, '\/')
}

function hackMultiple (projectName, url) {
    if(projectName && !!url.match(projectName) && !url.match('prd')) { // hack 多文件夹请求中未带prd的情况，转发到正确地址
        return url.replace(projectName,`${projectName}/prd`)
    }
    return url;
}
// 销毁中间件
function destroyMiddleware (maxMiddleware, cacheId, devCompilerCacheMap) {
    const now = +new Date();
    let middlewareList = []
    devCompilerCacheMap
    .forEach((item,index)=>{
        middlewareList.push({
            key: index,
            weight: item._visit / (now - item._timestamp) * 1000 // 使用次数越高，间隔越小的中间件会被留下
        })
    }) 
    middlewareList.sort((a, b) =>  b.weight - a.weight)
    let destroySize = middlewareList.length - maxMiddleware;
    let index = middlewareList.length - 1;
    while (destroySize > 0) {
        const key = middlewareList[index].key;
        if (key !== cacheId) {
            var md = devCompilerCacheMap.get(key);
            md.devServerMiddleware.close();
            devCompilerCacheMap.delete(key)
        }
        destroySize -= 1;
        index -= 1;
    }
}

function getCacheKey (cacheId, devCompilerCacheMap) {
    let __key = cacheId
    devCompilerCacheMap
    .forEach((item,index)=>{
      if(index.includes(cacheId)){
         __key = index
      }
    }) 
    return __key
}


// 工程编译结果的缓存
let devCompilerCacheMap = new Map()
const compilingSet = new Set()
const compiledCallbackMap = new Map()

let isCover
module.exports = (hot, rePackDll, port) => async function (ctx, next) {
    global.hot = hot
    process.env.NODE_ENV = 'development'
    ctx.res.setHeader('Access-Control-Allow-Origin', '*')
    isCover = isCover === void 0 ? rePackDll : isCover
    ctx.req.url = ctx.req.url.replace(/\?.*/, '')
    const { modeInfo, mode, logger, curDir } = ctx
   // 根据请当前请求所在项目更新缓存目录地址
    const rootDir = mode.resolveProjectRootDir(ctx.projectName)
    const configInfo = configResolver(rootDir)
    const matchcwd =new RegExp(`${path.basename(CWD)}/`,"gmi");
    const dllBaseDir = global.cacheDllDirectory.split('.qcache')[1].replace(matchcwd,'')
    global.cacheDllDirectory = `${rootDir}/.qcache${dllBaseDir}`

    if (modeInfo.modeName === MODE_NAMES.MULTIPLE && (!ctx.projectName || !mode.isProjectName(ctx.projectName))) {
        await next()
        return
    }

    if (modeInfo.modeName === MODE_NAMES.SINGLE) {
        ctx.projectName = ''
    }
 
    ctx.req.url = transformRequestUrlHash(ctx.req.url)
    ctx.req.url = hackMultiple(ctx.projectName, ctx.req.url)

    const formatCacheUrl = (url) => path.join('/'+ctx.projectName, url ).replace('.map','').slice(1);

    const setCacheIdMap = ( compiledAssetsNames) => compiledAssetsNames.map((item)=>formatCacheUrl(item));

    const __cacheId =  formatCacheUrl(transformRequestUrlPublicPath(ctx.req.url))
    const cacheId =  getCacheKey(__cacheId, devCompilerCacheMap)
   
    // 销毁中间件
    const { maxMiddleware } = global.ykit3CustomConfig || {}
    destroyMiddleware(maxMiddleware, cacheId, devCompilerCacheMap)

    if (!devCompilerCacheMap.get(cacheId)) {
        if (compilingSet.has(cacheId)) {
            await new Promise((resolve) => {
                let callbacks = compiledCallbackMap.get(cacheId)
                if (!callbacks) {
                    callbacks = [resolve]
                } else {
                    callbacks.push(resolve)
                }
                compiledCallbackMap.set(cacheId, callbacks)
            })
        }
    }

    let { compiler, devServerMiddleware, _visit, hotMiddleware, webpackConfig, dllConfig, dllWebpackConfig, compiledAssetsNames } = devCompilerCacheMap.get(cacheId) || {}

    try { 
        webpackConfig = configInfo.webpackConfig
        dllConfig = configInfo.dllConfig

        const splitOutputPath =  webpackConfig.output.path.split(CWD)[1]
        if(!!ctx.projectName) {
            const __path = splitOutputPath.replace(ctx.projectName,'')
            webpackConfig.output.path =  path.resolve(path.join(ctx.projectName,__path))
        }
       
        const isMoreDir = Object.keys(webpackConfig.entry).filter(item=>!!item.match('/')).length > 0
       
        if(!isMoreDir) {
            ctx.req.url = transformRequestUrlPublicPath(ctx.req.url) 
        }
        
        if (dllConfig.lib && isChangeDll(global.cacheDllDirectory, dllConfig.lib)) {
            logger.info('📦 正在打包dll,清稍后...')
            compilingSet.add(cacheId)
            dllWebpackConfig = generateDllWebpackConfig({
                dllConfig: {
                    lib: dllConfig.lib,
                    outputPath: global.cacheDllDirectory
                },
                logger,
                isCover,
                slient: true
            })
            isCover = false
            if (dllWebpackConfig) {
                const entryObj = {}
                Object.keys(dllWebpackConfig.entry).forEach(item => {
                    const entryConfig = dllWebpackConfig.entry[item]
                    if (!(_.isArray(entryConfig) || _.isString(entryConfig))) {
                        logger.error(chalk`{red entry ${item} 配置错误}，只支持数组和字符串类型。接收到的值为：`, dllWebpackConfig.entry[item])
                        throw new Error('')
                    }
                    entryObj[item] = mode.resolveWebpackEntry(dllWebpackConfig.entry[item])
                })
                dllWebpackConfig.entry = entryObj
                mode.handleOutputConfig(dllWebpackConfig.output, port)

                dllWebpackConfig.context = path.resolve(ctx.projectName)
                const dllCompiler = webpack(dllWebpackConfig)
                try {
                    await new Promise((resolve, reject) => {
                        dllCompiler.run((err, stats) => {
                            if (err) {
                                logger.error('打包失败', err)
                                reject(err)
                            }
                            setDllVersion(global.cacheDllDirectory, dllConfig.lib)
                            compilingSet.delete(cacheId) 
                            setTimeout(_=>{
                                resolve()
                            },100)
                        })
                    })
                } catch (e) {
                    logger.error(e)
                    return
                }
            }
        }

        if (ctx.req.url && ctx.req.url.includes('_dll@')) { // 返回dll
            const fileNamePattern = ctx.requestUrl.pathname.split('/').pop().replace(/@[^.]*\./, '@*.')
            const files = await globby(`${global.cacheDllDirectory}/${fileNamePattern}`)
            if (files.length) {
                ctx.body = fs.createReadStream( files[0]);
                return
            }
        }

        if (!devServerMiddleware) {
            compilingSet.add(cacheId)
            const entryObj = {}
            Object.keys(webpackConfig.entry).forEach(item => {
                let isRequestingEntry = false
                let entryItem = webpackConfig.entry[item]
                // 将入口的绝对地址转换成相对地址
                if(_.isArray(entryItem)){
                    const entryItemKey = entryItem.length - 1
                    const __entryItem =  entryItem[entryItemKey]
                    if(!!ctx.projectName && __entryItem.split(ctx.projectName).length > 1) {
                        entryItem[entryItemKey] = `.${__entryItem.split(ctx.projectName)[1]}`
                    } else {
                        entryItem[entryItemKey] = __entryItem.replace(CWD,'.')
                    }
                }else {
                    if(!!ctx.projectName && entryItem.split(ctx.projectName).length > 1) {
                        entryItem = `.${entryItem.split(ctx.projectName)[1]}`
                    } else {
                        entryItem = entryItem.replace(CWD,'.')
                    }
                }
                // 判断所请求的资源是否在入口配置中
                const matchingPath = `${item}@dev${path.extname(ctx.req.url)}` === transformRequestUrlPublicPath(ctx.req.url);
                const matchingKey = `/${item}@dev${path.extname(ctx.req.url)}`  ===  transformRequestUrlPublicPath(ctx.req.url);

                if (matchingPath || matchingKey) {
                    isRequestingEntry = true;
                }

                if(isRequestingEntry) {
                    if (hot) {
                        const hmrUrl = `http://127.0.0.1:${port}` + (modeInfo.modeName === MODE_NAMES.SINGLE ? `/${WEBPACK_HMR_URL}` : `/${ctx.projectName}/${WEBPACK_HMR_URL}`)
                        entryObj[item] = [`${require.resolve('webpack-hot-middleware/client')}?reload=true&path=${hmrUrl}&timeout=20000`, mode.resolveWebpackEntry(entryItem)]
                    } else {
                        const entryConfig = webpackConfig.entry[item]
                        if (!(_.isArray(entryConfig) || _.isString(entryConfig))) {
                            logger.error(chalk`{red entry ${item} 配置错误}，只支持数组和字符串类型。接收到的值为：`, webpackConfig.entry[item])
                            throw new Error('')
                        }
                        entryObj[item] = mode.resolveWebpackEntry(entryItem)
                    }
                }
            })

         
           if(Object.keys(entryObj).length === 0) {
             return await next()
           }

            webpackConfig.entry = entryObj
           
            mode.handleOutputConfig(webpackConfig.output, port)

            if (dllConfig.lib) {
                const dllReferencePlugins = generateDllReferencePlugins(ctx.projectName, Object.keys(dllConfig.lib))
                webpackConfig.plugins.push(...dllReferencePlugins.filter(Boolean))
            }

            webpackConfig.context = path.resolve(ctx.projectName)

            compiler = webpack(webpackConfig)
            devServerMiddleware = webpackDevMiddleware(compiler, {
                logLevel: 'debug',
                writeToDisk: isMoreDir,
                hot,
                watchOptions: {
                     aggregateTimeout: 200,
                     ignored: /node_modules|prd|.qcache/
                },
                reporter: (middlewareOptions, { stats, log }) => {
                   // log.log(stats)
                  // console.log(ctx.req.url )
                   // fs.existsSync(DllDir) && shell.cp('-rf', DllDir+'/*', webpackConfig.output.path)
                   // webpackStatsFormatter(stats, logger.info.bind(logger))
                }
            })

            devServerMiddleware.waitUntilValid((stats) => {
                ctx.compiledAssetsNames = Object.keys(stats.compilation.assets)
                while (compilingSet.has(cacheId)) { compilingSet.delete(cacheId) }
                let __keyCacheId = setCacheIdMap(ctx.compiledAssetsNames).toString()
            
               devCompilerCacheMap.set(__keyCacheId, {
                    compiler,
                    devServerMiddleware,
                    hotMiddleware,
                    webpackConfig,
                    dllConfig,
                    dllWebpackConfig,
                    compiledAssetsNames: ctx.compiledAssetsNames,
                    _timestamp:  +new Date(),
                    _visit: 1
                })
                const callbacks = compiledCallbackMap.get(cacheId)
                if (callbacks) callbacks.forEach(item => item && item())
                compiledCallbackMap.delete(cacheId)
            })

            if (hot) {
                hotMiddleware = webpackHotMiddleware(compiler, {
                    log: logger.info,
                    path: modeInfo.modeName === MODE_NAMES.SINGLE ? `/${WEBPACK_HMR_URL}` : `/${ctx.projectName}/${WEBPACK_HMR_URL}`,
                    heartbeat: HOT_HEART_BEAT_INTERVAL
                })
            }
        
        } else {
          const __devCompilerCacheMap = devCompilerCacheMap.get(cacheId)
          devCompilerCacheMap.set(cacheId,{...__devCompilerCacheMap, _visit: _visit+1})
        }
        if (hot) {
            ctx.hotMiddleware = hotMiddleware
        }
        ctx.compiledAssetsNames = compiledAssetsNames
        ctx.compiler = compiler
        {
            const dllFiles = await globby(path.join(global.cacheDllDirectory, '*_dll@*'))
            ctx.dllAssets = dllFiles.map(item =>{
                return  item.split('/').pop()
            })
        }
        ctx.res.statusCode = 200
        await devServerMiddleware(ctx.req, ctx.res, next)
    } catch (e) {
        devCompilerCacheMap.delete(cacheId)
        while (compilingSet.has(cacheId)) { compilingSet.delete(cacheId) }
        throw e
    }
}
