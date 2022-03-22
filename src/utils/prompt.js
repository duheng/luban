require('shelljs/global')
const inquirer = require('inquirer')
const { printLog } = require('./base')

const askCurrentDir = async () => {
    const __isCurrentDir = await inquirer.prompt([
        {
            type:"confirm",
            message:"是否以当前目录作为项目根目录:",
            name:"iscur",
         
        }
    ])
    if(__isCurrentDir) {
      return __isCurrentDir.iscur
    } else {
      printLog({type:'error',text:'askCurrentDir函数出错'})
    }
}

const askProductName = async () => {
    const __productName = await inquirer.prompt([
        {
            type:"input",
            message: "请输入项目名称:" ,
            name:"name",
         
        }
    ])
    if(__productName) {
      return __productName.name
    } else {  
      printLog({type:'error',text:'askProductName函数出错'})
    }
}

const askReplayDir = async (target_name) => {
    const __isReplayDir = await inquirer.prompt([
        {
            type:"confirm",
            message:`检测到您的目录已存在${target_name}文件夹，是否替换:`,
            name:"replay",
        }
    ])
    if(__isReplayDir) {
      return __isReplayDir.replay
    } else {
      printLog({type:'error',text:'askReplayDir函数出错'})
    }
}

const selectTmpl = async () => {
    const __tmpl = await inquirer.prompt([
        {
            type:"list",
            message:"请选择一个项目类型:",
            name:"tmpl",
            default:"green",
            prefix:"☆☆☆☆☆",
            suffix:"☆☆☆☆☆",
            choices:[
              {
                name : 'egg+react+redux的前后端结合的ssr项目(推荐)',
                value : "Egg_React_Redux"
              },
              {
                name : 'react+redux+antd的前后端结合的client项目',
                value : "React_Redux_Antd"
              },
              {
                name : 'koa+react+redux的前后端结合的ssr项目',
                value : "Koa_React_Redux"
              },
              {
                name : 'react项目',
                value : "React"
              },{
                name : 'react+redux的项目',
                value : "React_Redux"
              },{
                name : 'Vue项目',
                value : "Vue"
              }
            ],
            filter: val => {
              return val.toLowerCase()
            }
        }
    ])
    if(__tmpl) {
      return __tmpl.tmpl
    } else {
      printLog({type:'error',text:'selectTmpl出错'})
    }
  }

module.exports = {
    selectTmpl,
    askCurrentDir,
    askProductName,
    askReplayDir
}