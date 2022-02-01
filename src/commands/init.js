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
  const __tmplOriginUtl = `https://github.com/duheng/tmpl_${selectTmpl}.git -b master`
  console.log('模版仓库地址:',__tmplOriginUtl)
  if (!which('git')) {
    echo('检测到您还没有安装git，请先安装git');
    exit(1);
  }
  exec(`git config http.sslVerify false`)
  exec(`git config https.sslVerify false`)
  echo(`🔗 模版 ${selectTmpl} 下载中...\r`);
  if (exec(`git clone ${__tmplOriginUtl}`).code !== 0) {
    echo('Error: Git clone failed');
    exit(1);
  }
  spinner.succeed(`模版 ${selectTmpl} 已下载\r`)
}

const pullOriginTmpl = (selectTmpl) => {
   echo(`检测模版 ${selectTmpl} 的变更...\r`);
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
      const __name = await askProductName() || ''       // 如果没有输入项目名则用当前所在文件夹名
      const __distName = `${CWD}/${__name}`
      const __existDir = fs.existsSync(__distName)      // 是否已存在项目

      if(__existDir && !!__name ) { // 已存在，并且输入了文件名的时候需要走这个逻辑，没有输入文件名默认在当前文件夹创建，此时当前文件夹名就是项目名
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
        !__existDir && mkdir('-p',__distName)
        cp('-Rf',__source,__distName)
        spinner.succeed(`项目 ${__name} 已创建\r`)
        installPackage(__distName)
        spinner.succeed(`请执行: cd ${__name} && luban server \r`)
      }catch(err) {
        spinner.fail(`项目 ${__name} 已创建失败\r\n${err}`)
      }

      spinner.stop()
     
}
