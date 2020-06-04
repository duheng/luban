const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./base.config')
const { config } = require('../utils/common')
const path = require('path')
const CWD = process.cwd()
const buildPath =  path.resolve(CWD, config.build)
const jsName  = 'js/[name]@dev.js'
const cssName = 'css/[name]@dev.css'
module.exports = () => {
  return merge(baseConfig(config), {
    output: {
      path: buildPath,
      publicPath: config.static[process.env.MODE],
      chunkFilename: 'js/[name]-[chunkhash:8].js',
      filename: jsName
    },
    mode: 'development',
    devtool: 'source-map',

    performance: {
      hints: false,
    },
    devServer: {
      contentBase: buildPath,
      compress: true,
      port: 9000
    }
  })
}