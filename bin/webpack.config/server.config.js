const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')
const { config } = require('../utils/common')
const CWD = process.cwd()
console.log('entryPath----',config)
const rules = require('./rules')
const entryPath =  path.join(CWD, config.server,'index.js')

const buildPath =  path.resolve(CWD, config.build)
const jsName  = 'js/[name].js'

module.exports = {
  target: 'node',
  mode: 'development',
  entry: {'server':entryPath},
  output: {
    filename: jsName,
    path: buildPath
  },
  module: rules(),
  externals: [webpackNodeExternals()]
}