#!/usr/bin/env node

require('shelljs/global')
const fs       = require("fs")
const path     = require('path')
const ora = require('ora')  
const { askCurrentDir, askProductName, askReplayDir, selectTmpl } = require('../utils/prompt')
const CWD = process.cwd()
const tmplDir = path.join(__dirname,'..','..','.tmpl')

const spinner = ora({
  text: '',
  spinner: {
    interval: 100, // optional
    frames: ['🚚', '🔗', '🔍','📃']
  }
})

const getOriginTmpl = (selectTmpl) => {
  const __tmplOriginUtl = `git+ssh://git@github.com/duheng/tmpl_${selectTmpl}.git`
  if (!which('git')) {
    echo('检测到您还没有安装git，请先安装git');
    exit(1);
  }
  echo(`模版 ${selectTmpl} 下载中...\r`);
  if (exec(`git clone ${__tmplOriginUtl}`).code !== 0) {
    echo('Error: Git clone failed');
    exit(1);
  }
  spinner.succeed(`模版 ${selectTmpl} 已下载\r`)
}

const pullOriginTmpl = (selectTmpl) => {
   echo(`检测模版 ${selectTmpl} 的变更...\r`);
   const __tmplOriginUtl = `https://github.com/duheng/tmpl_${selectTmpl}.git`
  if (!which('git')) {
    spinner.fail('检测到您还没有安装git，请先安装git');
    exit(1);
  }
 
  if (exec(`git pull`).code !== 0) {
    spinner.info('远程模版有更新,正在重新下载');
    cd('..')
    rm('-rf',`tmpl_${selectTmpl}`)
    getOriginTmpl(selectTmpl)
  }
  spinner.succeed(`模版 ${selectTmpl} 已更新\r`)
}

const pullTmpl = (selectTmpl) => {
  !fs.existsSync(tmplDir) && mkdir('-p',tmplDir)
  const __selectTmpl = path.join(tmplDir,`tmpl_${selectTmpl}`)
  if(!fs.existsSync(__selectTmpl)) {
    cd(tmplDir)
    getOriginTmpl(selectTmpl)
  } else {
    cd(__selectTmpl)
    pullOriginTmpl(selectTmpl)
  }
}

const installPackage = (pakDir) => {
  echo(`🔍 安装依赖包...\r`);
  cd(pakDir)
  exec('npm install')
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

      spinner.start()
       // 下载对应模版
      pullTmpl(__selectTmpl)

     
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
        installPackage(__isCur ? CWD : `${CWD}/${__name}`)
      }catch(err) {
        spinner.fail(`项目 ${__name} 已创建失败\r\n${err}`)
      }

      spinner.stop()
     
}
