#!/usr/bin/env node

require('shelljs/global')
const path = require('path')
//主: webpack4之后需 webpack命令被抽取到webpack-cli中，如果webpack-cli安装在本地则需要用当前node_modules中的webpack才能找到cli
const webpack = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'webpack');
const webpackDevServer = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'webpack-dev-server');
const webpackDev = path.resolve(__dirname, '..', 'webpack.config', 'development.config') 
const webpackProd = path.resolve(__dirname, '..', 'webpack.config', 'production.config') 

const server = (options) => {
		//exec(webpack + ' --config ' + dllWebpack)
  return new Promise((resolve, reject) => {
    //exec(`${webpack} --config ${webpackProd} --mode=development --colors`)
    exec(webpackDevServer + ' --config ' + webpackDev + ' --colors')
    resolve(true)

  })
}

module.exports = async (options) => {
	process.env.NODE_ENV = 'development'
	process.env.MODE = 'development'
    await server(options)
 
}
