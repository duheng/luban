const path = require('path');
const fs = require('fs');
const CWD = process.cwd();
const { exec } = require('child_process');
const { config } = require('../utils/common');
const { cache } = config;
/**
 *
 * skipLubanCache 是否阻止缓存，默认值 false
 *
 * **/
const { skipLubanCache = false, NODE_ENV, deploy_type } = process.env;

const jenkinsPath = '/home/q/prj/npm'; //jenkins缓存路径
const isJenkinsEnv = fs.existsSync(jenkinsPath); // 是否集成环境

const useCache =
  !(skipLubanCache == 'true' || skipLubanCache == true) && !!cache;

const basePath = isJenkinsEnv ? path.join(jenkinsPath) : path.join(CWD); // 机器根路径
const projectDirName = path.basename(CWD);
const cachePath = `.luban-cache/luban-cache-loader/${projectDirName}`; // 按照BUILDENV环境变量建立loader缓存文件夹
const cacheDirectory = path.resolve(path.join(basePath, cachePath));
/***
 * 建立dll缓存目录
 */
const cacheDllPath = `.luban-cache/luban-cache-dll/${projectDirName}`; // 按照BUILDENV环境变量建立dll缓存文件夹
const cacheDllDirectory = path.resolve(path.join(basePath, cacheDllPath));
/***
 * 建立多进程压缩缓存目录
 */
const terserCache = `.luban-cache/terser-cache/${projectDirName}`; // 按照BUILDENV环境变量建立dll缓存文件夹
const terserCacheDirectory = path.resolve(path.join(basePath, terserCache));
/***
 * 清理缓存
 */
const cleanCache = () => {
  exec(`rm -rf ${cacheDirectory}`, (err, stdout, stderr) => {}); // 清理lorder缓存
  exec(`rm -rf ${terserCacheDirectory}`, (err, stdout, stderr) => {}); // 清理压缩缓存
};

if (!useCache) {
  cleanCache();
  exec(`rm -rf ${cacheDllDirectory}`, (err, stdout, stderr) => {}); // 删除dll，因为dll做了独立的pitch，有自动删除机制，所以不放在cleanCache函数里
}

isJenkinsEnv &&
  console.log(
    `环境变量skipLubanCache的值是: ${skipLubanCache}\n是否有BUILDENV环境变量: ${BUILDENV}\n是否使用缓存模式: ${useCache}\n缓存路径是: ${cacheDirectory}`
  );

module.exports = {
  useCache,
  cacheDirectory,
  cacheDllDirectory,
  terserCacheDirectory,
  cleanCache,
};
