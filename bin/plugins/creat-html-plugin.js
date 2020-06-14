
const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
const child_process = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const  tmpl  = require('blueimp-tmpl')
const { getTemplate } = require('../utils/common')
console.log('tmpl----->',  tmpl)
const nameReg = /^([^\@]*)\@([^\.]+)(\.(js|css))$/

const crypto = require('crypto')

const HtmlWebpackPluginItem = (name) => {
     console.log('html--',getTemplate())
    const temp =  getTemplate()
    return new HtmlWebpackPlugin({
        inject: false, // 禁用自动注入
        filename: `${name}.html`,
        chunks:[`${name}`],
        templateContent: ({htmlWebpackPlugin}) => {
          console.log('data+++++', htmlWebpackPlugin)
      return tmpl(`${getTemplate()}`, htmlWebpackPlugin)
    } 
    })
}


const CreatHtmlPlugin = (mode, config) => {

   let __htmlPlugin = []

   if(!!Object.keys(config.entry) && Object.keys(config.entry).length > 0) {
    for(let name in config.entry) {
        __htmlPlugin.push(HtmlWebpackPluginItem(name))
    }
   } else {
     console.error('creat-html-plugin没有找到入口')
   }
   return __htmlPlugin
}

module.exports = CreatHtmlPlugin
