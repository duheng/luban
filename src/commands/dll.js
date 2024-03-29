require('shelljs/global')
const path = require('path')
const fs = require('fs')
const { printLog } = require('../utils/base');
const { setDllVersion } = require("../utils/dllPitch");
const { config, webpackCommand, useDllPath } = require('../utils/common')
const webpackDll = path.resolve(__dirname, '..', 'webpack.config', 'webpack.dll') 

const dll = (options) => {
  return new Promise((resolve, reject) => {
    exec(`${webpackCommand} --config ${webpackDll} --mode production --no-stats`)
    resolve(true)
  })
}

module.exports = async (options) => {
	if(!!config.library && Object.keys(config.library).length > 0){
		printLog({text: 'Build Dll...'})
		await dll(options)
		const _useDllPath = useDllPath()
		setDllVersion(_useDllPath, config)
		printLog({text: 'Build Dll Complete.'})
	} else {
		return null
	}
}
