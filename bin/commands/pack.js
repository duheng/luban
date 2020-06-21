#!/usr/bin/env node

require('shelljs/global')
const fs = require("fs")
const path = require('path')
const CWD = process.cwd()
const { config } = require('../utils/common')
//主: webpack4之后需 webpack命令被抽取到webpack-cli中，如果webpack-cli安装在本地则需要用当前node_modules中的webpack才能找到cli
const webpack = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'webpack')
const webpackDev = path.resolve(__dirname, '..', 'webpack.config', 'development.client.config') 
const webpackProd = path.resolve(__dirname, '..', 'webpack.config', 'production.client.config') 
const webpackServer = path.resolve(__dirname, '..', 'webpack.config', 'server.config') 

const pack = (options, action) => {
  return new Promise((resolve, reject) => {
  	exec(action)
    resolve()
  })
}

module.exports = async (options) => {
  let webpackConfig = webpackDev
  if(options.node) {
    process.env.NODE_ENV = 'development'
    process.env.MODE = 'development'
    webpackConfig = webpackServer
  } else {
    try {
      if (!fs.existsSync(path.join(CWD, config.build, config.dll))) {
      await require('./dll')(options)
        }
    } catch (e) {
      console.log('打包dll失败：',e)
    }

    if(options.prod) { //生产环境
      process.env.NODE_ENV = 'production'
      process.env.MODE = 'production'
      webpackConfig = webpackProd
    } else {
      process.env.NODE_ENV = 'development'
      process.env.MODE = 'development'
      webpackConfig = webpackDev
    }
  }


  const wbpackAction = `${webpack} --config ${webpackConfig} --mode=${process.env.NODE_ENV} --colors`
  await pack(options, wbpackAction)
}
