#!/usr/bin/env node

require('shelljs/global')
const fs = require("fs")
const path = require('path')
const CWD = process.cwd()
const { config } = require('../utils/common')
//主: webpack4之后需 webpack命令被抽取到webpack-cli中，如果webpack-cli安装在本地则需要用当前node_modules中的webpack才能找到cli
const webpack = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'webpack');
const webpackDevServer = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'webpack-dev-server');
const webpackDev = path.resolve(__dirname, '..', 'webpack.config', 'development.client.config') 
const webpackProd = path.resolve(__dirname, '..', 'webpack.config', 'production.client.config') 

const server = (options) => {
		//exec(webpack + ' --config ' + dllWebpack)
  return new Promise((resolve, reject) => {
    exec(webpackDevServer + ' --config ' + webpackDev + ' --colors')
    resolve(true)

  })
}

module.exports = async (options) => {
	process.env.NODE_ENV = 'development'
	process.env.MODE = 'development'
   	try {
        if (!fs.existsSync(path.join(CWD, config.build, config.dll))) {
			await require('./dll')(options)
        }
    } catch (e) {
       console.log('打包dll失败：',e)
    }
    await server(options)
 
}
