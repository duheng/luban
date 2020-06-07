#!/usr/bin/env node

require('shelljs/global')
const path = require('path')
const { config } = require('../utils/common')

//主: webpack4之后需 webpack命令被抽取到webpack-cli中，如果webpack-cli安装在本地则需要用当前node_modules中的webpack才能找到cli
const webpack = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'webpack');
const webpackDll = path.resolve(__dirname, '..', 'webpack.config', 'webpack.dll') 

const dll = (options) => {
		//exec(webpack + ' --config ' + dllWebpack)
  return new Promise((resolve, reject) => {
   exec(webpack + ' --config ' + webpackDll + ' --mode=production --colors')
    resolve(true)

  })
}

module.exports = async (options) => {
	if(!!config.library && Object.keys(config.library).length > 0){
		await dll(options)
	} else {
		return null
	}
}
