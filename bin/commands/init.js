#!/usr/bin/env node

require('shelljs/global')
const fs       = require("fs")
const path     = require('path')

const { askCurrentDir, askProductName, askReplayDir, selectTmpl } = require('../utils/prompt')
const CWD = process.cwd()
const tmplDir = path.join(__dirname,'..','..','.tmpl')
 
// const path = require('path')
// //主: webpack4之后需 webpack命令被抽取到webpack-cli中，如果webpack-cli安装在本地则需要用当前node_modules中的webpack才能找到cli
// const webpack = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'webpack');
// const webpackDevServer = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'webpack-dev-server');
// const webpackDev = path.resolve(__dirname, '..', 'webpack.config', 'development.config') 
// const webpackProd = path.resolve(__dirname, '..', 'webpack.config', 'production.config') 

// const server = (options) => { 
// 		//exec(webpack + ' --config ' + dllWebpack)
//   return new Promise((resolve, reject) => {
//     exec(`${webpack} --config ${webpackProd} --mode=development --colors`)
//    exec(webpackDevServer + ' --config ' + webpackProd + ' --colors')
//     resolve(true)

//   })
// }



const pullOriginTmpl = (selectTmpl) => {
  const __tmplOriginUtl = `https://github.com/duheng/tmpl_${selectTmpl}.git`
  if (!which('git')) {
    echo('检测到您还没有安装git，请先安装git');
    exit(1);
  }
  if (exec(`git clone ${__tmplOriginUtl}`,{fatal:true}).code !== 0) {
    echo('Error: Git clone failed');
    exit(1);
  }
}

const pullTmpl = (selectTmpl) => {

  !fs.existsSync(tmplDir) && mkdir('-p',tmplDir)

  const __selectTmpl = path.join(tmplDir,`tmpl_${selectTmpl}`)
  if(!fs.existsSync(__selectTmpl)) {
    cd(tmplDir)
    pullOriginTmpl(selectTmpl)
  }
}

module.exports = async (options) => {
      const __isCur = await askCurrentDir()
      const __name = __isCur ? CWD.split('/').pop() : await askProductName()
       // 是否已存在项目
      if(fs.existsSync(`${CWD}/${__name}`)) {
        const __isreplay = await askReplayDir(__name)
        if(!__isreplay) {
          console.log('好的，请重新创建并设置一个项目名称')
          return 
        }
      } 
       // 选择模版
      const __selectTmpl = await selectTmpl()
       // 下载对应模版
      pullTmpl(__selectTmpl)
       // 拷贝模版到业务目录
      const __source = `${tmplDir}/tmpl_${__selectTmpl}/*`

      if(__isCur) {
        cp('-Rf',__source,`${CWD}`) 
      }else {
        mkdir('-p',`${CWD}/${__name}`)
        cp('-Rf',__source,`${CWD}/${__name}`)
      }
}
