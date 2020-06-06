#!/usr/bin/env node

require('shelljs/global')
const fs       = require("fs")
const path     = require('path')
const ora = require('ora')  
const { askCurrentDir, askProductName, askReplayDir, selectTmpl } = require('../utils/prompt')
const CWD = process.cwd()
const tmplDir = path.join(__dirname,'..','..','.tmpl')

const pullOriginTmpl = (selectTmpl) => {
  const __tmplOriginUtl = `https://github.com/duheng/tmpl_${selectTmpl}.git`
  if (!which('git')) {
    echo('检测到您还没有安装git，请先安装git');
    exit(1);
  }

  if (exec(`git clone ${__tmplOriginUtl}`).code !== 0) {
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

      const spinner = ora({
        text: `模版 ${__selectTmpl} 载中...\r\n`,
        spinner: {
          interval: 80, // optional
          frames: ['🚚', '🔗', '🔍','📃']
        }
      }).start()
       // 下载对应模版
      pullTmpl(__selectTmpl)
      spinner.succeed(`模版 ${__selectTmpl} 已下载\r`)
       // 拷贝模版到业务目录
      const __source = `${tmplDir}/tmpl_${__selectTmpl}/*`
      try {
        if(__isCur) {
          cp('-Rf',__source,`${CWD}`) 
        }else {
          mkdir('-p',`${CWD}/${__name}`)
          cp('-Rf',__source,`${CWD}/${__name}`)
        }
        spinner.succeed(`项目 ${__name} 已创建\r`)
      }catch(err) {
        spinner.fail(`项目 ${__name} 已创建失败\r\n${err}`)
      }
      spinner.stop()
     
}
