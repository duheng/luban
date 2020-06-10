const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseConfig = require('./base.config')
const CreatHtmlPlugin = require('../plugins/creat-html-plugin')
const { config } = require('../utils/common')
const __baseConfig = baseConfig(config)

const CWD = process.cwd()
const buildPath =  path.resolve(CWD, config.build)

const jsName  = 'js/[name]@dev.js'
const cssName = 'css/[name]@dev.css'

const plugins = () => {
  let __plugins = [
      ...CreatHtmlPlugin('development',__baseConfig)
    ]
    return __plugins
}

module.exports = () => {
  return merge(__baseConfig, {
    output: {
      path: buildPath,
      publicPath: config.static[process.env.MODE],
      chunkFilename: 'js/[name]-[chunkhash:8].js',
      filename: jsName
    },
    mode: 'development',
    devtool: 'none',
    performance: {
      hints: false,
    },
    plugins: plugins(),
    devServer: {
      contentBase: buildPath,
      compress: true,
      host:'0.0.0.0',
      port: 9000,
      hot: true,
      inline: true,
      historyApiFallback: true

    }
  })
}