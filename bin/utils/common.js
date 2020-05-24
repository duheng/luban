const path = require('path')
const fs = require("fs")
const confman = require('confman')
const CWD = process.cwd()
const name = 'luban'
const getConfig = () => {
   let configs = confman.load(`${CWD}/${name}`);
   return configs
}

const filterFile = (dir, pattern) => {
    try {
        if (!fs.existsSync(dir)) {
            return false;
        }
    } catch (e) {
        return false;
    }
	const filenames = fs.readdirSync(dir);

    for (let i = 0; i < filenames.length; i++) {
	
        if (new RegExp(pattern).test(filenames[i])) {
            return filenames[i];
        }
    }
    return false;
}

const getEntry = () => {
  const __config = getConfig()
  if(Object.keys(__config.entry).length > 0) {
    return __config.entry
  } else {
    const pageDir = path.join(CWD,__config.base,__config.pages)  
    try {
        if (!fs.existsSync(pageDir)) {
            console.error(`请设置项目配置文件入口entry字段`)
            return {}
        }
    } catch (e) {
        console.error(`请设置项目配置文件入口entry字段`)
        return {}
    }
   
    const loadPageDir = fs.readdirSync(pageDir);
    let __entry = {}
    for (let i = 0; i < loadPageDir.length; i++) {
        const __pageDirItem = path.join(pageDir, loadPageDir[i])
        if(fs.statSync(__pageDirItem).isDirectory()) {
            __entry[loadPageDir[i]] = `./${__config.base}/${__config.pages}/${loadPageDir[i]}/index.js`
        }
    }
    return __entry
  }
}

module.exports = {
	config: getConfig(),
    filterFile,
    entry: getEntry()
}