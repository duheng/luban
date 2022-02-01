require('shelljs/global')
const path = require('path')
const fs = require('fs')
const { config, webpackCommand } = require('../utils/common')
const webpackDll = path.resolve(__dirname, '..', 'webpack.config', 'webpack.dll') 

const dll = (options) => {
  return new Promise((resolve, reject) => {
    exec(`${webpackCommand} --config ${webpackDll} --mode production --no-stats`)
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
