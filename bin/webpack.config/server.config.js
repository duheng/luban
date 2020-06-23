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
    path: buildPath,
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [{
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: [
          {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  require.resolve('@babel/preset-react')
                ]
              }
          }
      ]
  }]
  }
  //  ,
  //  externals: [webpackNodeExternals()]
}