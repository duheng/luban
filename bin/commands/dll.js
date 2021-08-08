#!/usr/bin/env node

require('shelljs/global')
const path = require('path')
const fs = require('fs')
const webpack = require("webpack");
const { printLog } = require('../utils/base')
const { getConfig, isContainFile } = require('../utils/common')
const {  cacheDllDirectory } = require("../utils/buildCache");
const config = !!global.devServerconfig ? global.devServerconfig : getConfig()

const packDll = (options) => {
	if(!!config.library && Object.keys(config.library).length > 0){
		return new Promise((resolve, reject) => {
			const webpackDll = path.resolve(__dirname, '..', 'webpack.config', 'webpack.dll') 
			exec(`webpack --config ${webpackDll} --mode=production --colors`)
			resolve(true)
		})
	} else {
		return []
	}
}

const referenceDll = (projectName) => {
	const ctxPath = path.resolve(projectName)
	if(!!config.library && Object.keys(config.library).length > 0){
		return Object.keys(config.library).map(name => {
			const fileName = isContainFile(path.join(cacheDllDirectory), `${name}[^.]*\\.manifest\\.json`)
			if (!fileName) {
				printLog({type: 'error', text:`没有找到${name}对应的dll manifest.json 文件`})
				return null
			}
			return new webpack.DllReferencePlugin({
				context: ctxPath,
				manifest: require(path.join(cacheDllDirectory, fileName))
			})
		})
	} else {
		return []
	}
}

const isDllFile = (url) => {
	const __url = url.split('/').pop().split('@')[0]
	return Object.keys(config.library).includes(__url)
}

module.exports = {
	packDll,
    referenceDll,
	isDllFile
} 