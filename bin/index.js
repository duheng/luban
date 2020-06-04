#!/usr/bin/env node

const commander = require('commander')
const packages = require('../package.json')

commander
  .version(packages.version)

commander
  .command('pack')
  .description('打包💼')
  .option('-p --prod', '打包线上版本')
  .option('-m --min', '压缩优化')
  .allowUnknownOption()
  .action(async (options) => {
    await require('./commands/pack')(options)
  })

commander
.command('server')
.description('本地开发服务🐆')
.allowUnknownOption()
.action(async (options) => {
  try {
    await require('./commands/server')(options)
  }catch(err){
    console.log('server--',err)
  }
    
})
commander
  .command('dll')
  .description('打包第三方模块🐆')
  .allowUnknownOption()
  .action(async (options) => {
    try {
      await require('./commands/dll')(options)
    }catch(err){
      console.log('dllAction--',err)
    }
     
  })

commander.parse(process.argv)
