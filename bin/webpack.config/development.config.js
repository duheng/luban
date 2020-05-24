const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./base.config')
const { config } = require('../utils/common')
const path = require('path')
const CWD = process.cwd()

const jsName  = 'js/[name]@dev.js'
const cssName = 'css/[name]@dev.css'
 
module.exports = () => {
  return merge(baseConfig(config), {
    output: {
      path: path.resolve(CWD, config.build),
      publicPath: config.static[process.env.MODE],
      chunkFilename: 'js/[name]-[chunkhash:8].js',
      filename: jsName
    },
    mode: 'development',
    devtool: 'source-map',
    performance: {
      hints: false,
    },
  })
}