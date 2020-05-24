#!/usr/bin/env node

require('shelljs/global')
const fs = require("fs")
const path = require('path')
const CWD = process.cwd()
const { config } = require('../utils/common')
//主: webpack4之后需 webpack命令被抽取到webpack-cli中，如果webpack-cli安装在本地则需要用当前node_modules中的webpack才能找到cli
const webpack = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'webpack');
const webpackDev = path.resolve(__dirname, '..', 'webpack.config', 'development.config') 
const webpackProd = path.resolve(__dirname, '..', 'webpack.config', 'production.config') 

const pack = (options, action) => {
  return new Promise((resolve, reject) => {
  	exec(action)
    resolve()
  })
}

module.exports = async (options) => {
	try {
        if (!fs.existsSync(path.join(CWD, config.build, config.dll))) {
			await require('./dll')(options)
        }
    } catch (e) {
       console.log('打包dll失败：',e)
    }
    let webpackConfig = webpackDev
	if(options.prod) {
		process.env.NODE_ENV = 'production'
		webpackConfig = webpackProd
	} else {
		process.env.NODE_ENV = 'development'
	}

	if(options.min) {
		process.env.MODE = 'production'
	} else {
		process.env.MODE = 'development'
	}

    const wbpackAction = `${webpack} --config ${webpackConfig} --mode=${process.env.NODE_ENV} --colors`
    await pack(options, wbpackAction)
}
