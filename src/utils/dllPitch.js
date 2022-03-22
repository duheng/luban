require("shelljs/global");
const fs = require('fs')
const crypto = require('crypto')
const digest = (str) => {
    return crypto.createHash('md5').update(str).digest('hex');
}

const getDllVersion = (dllPath, dllLib) => {
  const dllVersion =  digest(dllLib)
  const __vpath = `${dllPath}/${dllVersion}.txt`
  const existsVpath =  fs.existsSync(__vpath)
  if(existsVpath) {
    return true
  } else {
    rm('-rf',`${dllPath}/*`);
    return false
  }
}

const setDllVersion = (dllPath, config) => {
    const dllLib = !!config && !!config.library ? config.library : {}
    const __dllLib = JSON.stringify(dllLib)
    const dllVersion =  digest(__dllLib)
    const __vpath = `${dllPath}/${dllVersion}.txt`
    !fs.existsSync(dllPath) && mkdir('-p',dllPath);
    !fs.existsSync(__vpath) && touch(__vpath);
}

const isChangeDll = (dllPath, config) => {
   const dllLib = !!config && !!config.library ? config.library : {}
   if(Object.keys(dllLib).length > 0) {
      if(!fs.existsSync(dllPath)) {
        return true
      } else {
        const __dllLib = JSON.stringify(dllLib)
        return !getDllVersion(dllPath, __dllLib) // 存在这个版本则不需要再次打包，不存在则打包
      }
   } else {
     return false
   }
}

module.exports = {
    isChangeDll,
    setDllVersion
}
