require("shelljs/global");
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const { cacheDirectory } = require('./buildCache')
const CWD = process.cwd();
const pkg = require(path.join(CWD, 'package.json'))

const digest = (str) => {
    return crypto.createHash('md5').update(str).digest('hex');
}

const getCacheVersion = (cacheDir, dependencies) => {
  const cacheVersion =  digest(dependencies)
  const __vpath = `${cacheDir}/${cacheVersion}.txt`
  const existsVpath =  fs.existsSync(__vpath)
  if(existsVpath) {
    return true
  } else {
    return false
  }
}

const setCacheVersion = (env) => {
    const cacheDir = `${cacheDirectory}/${env}`
    const dependencies =  !!pkg && !!pkg.dependencies ? pkg.dependencies : {}
    const __dependencies = JSON.stringify(dependencies)
    const cacheVersion =  digest(__dependencies)
    const __vpath = `${cacheDir}/${cacheVersion}.txt`
    !fs.existsSync(cacheDir) && mkdir('-p',cacheDir);
    !fs.existsSync(__vpath) && touch(__vpath);
}

const isChangeCache = (cacheDir) => {
   const dependencies =  !!pkg && !!pkg.dependencies ? pkg.dependencies : {}
   if(Object.keys(dependencies).length > 0 && fs.existsSync(cacheDir)) {
      const __dependencies = JSON.stringify(dependencies)
      return !getCacheVersion(cacheDir, __dependencies) // 存在这个版本则不需要再次打包，不存在则打包
   } else {
     return false
   }
}

const changeCache = (env) => {
  const _cacheDir = `${cacheDirectory}/${env}`
  if(isChangeCache(_cacheDir)) {
    rm('-rf',`${_cacheDir}/*`);
  }
}

module.exports = {
  changeCache,
  setCacheVersion
}
