const path = require('path')
const fs = require('fs')
const CWD = process.cwd();
const { exec } = require('child_process');
const cacheName = '.luban_cache'
/**
 * 
 * skipLubanCache 是否阻止缓存，默认值 false
 * 
 * **/

const { skipLubanCache = false, NODE_ENV = ''  } = process.env

const jenkinsPath = '/home/prj/npm' //jenkins缓存路径
const isJenkinsEnv = fs.existsSync(jenkinsPath) // 是否集成环境


const useCache = !JSON.parse(skipLubanCache) && !!NODE_ENV
const basePath = isJenkinsEnv ? path.join(jenkinsPath) : path.join(CWD) // 机器根路径
const projectDirName = path.basename(CWD)
const cachePath = `${cacheName}/luban-cache-loader/${projectDirName}/${NODE_ENV}` // 按照NODE_ENV环境变量建立loader缓存文件夹
const cacheDirectory = path.resolve(path.join(basePath,cachePath))
/***
 * 建立dll缓存目录
*/
const cacheDllPath = `${cacheName}/luban-cache-dll/${projectDirName}/${NODE_ENV}` // 按照NODE_ENV环境变量建立dll缓存文件夹
const cacheDllDirectory = global.cacheDllDirectory = path.resolve(path.join(basePath,cacheDllPath))
/***
 * 建立多进程压缩缓存目录
*/

const terserCache = `${cacheName}/terser-cache/${projectDirName}/${NODE_ENV}` // 按照NODE_ENV环境变量建立dll缓存文件夹
const terserCacheDirectory = global.terserCacheDirectory = path.resolve(path.join(basePath,terserCache))

if(JSON.parse(skipLubanCache)) {
    exec(`rm -rf ${cacheDirectory}`, (err, stdout, stderr) => {});
}

isJenkinsEnv && console.log(`环境变量skipLubanCache的值是: ${skipLubanCache}\n是否有NODE_ENV环境变量: ${NODE_ENV}\n是否使用缓存模式: ${useCache}\n缓存路径是: ${cacheDirectory}`)

module.exports = {
    useCache, 
    cacheDirectory,
    cacheDllDirectory,
    terserCacheDirectory
}