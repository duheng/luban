
const path = require('path')
const fs = require('fs')
const shell = require('shelljs')
const child_process = require('child_process');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const nameReg = /^([^\@]*)\@([^\.]+)(\.(js|css))$/

const crypto = require('crypto')

const HtmlWebpackPluginItem = (name) => {
    return new HtmlWebpackPlugin({
        inject: true, // 禁用自动注入
        filename: `${name}.html`,
        chunks:[`${name}`],
        templateContent: ({htmlWebpackPlugin}) => {
          const { js } = htmlWebpackPlugin.files
          console.log('htmlWebpackPlugin.tags.bodyTags--',htmlWebpackPlugin.tags.bodyTags)
            return  `
            <html>
              <head>
                ${htmlWebpackPlugin.tags.headTags}
              </head>
              <body>
                <h1>Hello World</h1>
                <div id="app"></div>
                ${htmlWebpackPlugin.tags.bodyTags}
              </body>
            </html>
          `
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
