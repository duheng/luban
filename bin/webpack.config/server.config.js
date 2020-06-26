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
    extensions: ['.js', '.jsx', '.scss']
  },
  module: {
    rules: [
      {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: require.resolve('babel-loader'),
                  options: {
                    presets: [
                      require.resolve('@babel/preset-env'),
                      require.resolve('@babel/preset-react')
                    ],
                    plugins: [
                      // 装饰器
                      [
                          require.resolve("@babel/plugin-proposal-decorators"), { "legacy": true }
                      ],
                      // 可选链式调用
                      require.resolve('@babel/plugin-proposal-optional-chaining'),
                      // 解析类的属性
                      require.resolve('@babel/plugin-proposal-class-properties'),
                      require.resolve('@babel/plugin-transform-runtime')
                    ]
                  }
              }
          ]
      },
      {
          test: /\.(css|less|scss|sass)$/,
          exclude: /node_modules/,
          use: [
              { loader: require.resolve( './loader/css-remove-loader') },
          ]
      },
      { test: /\.(png|jpg|gif|webp)$/, use: [{ loader: 'url-loader', options: { limit: 8192 } }] }
    ]
  }
   ,
   externals: [webpackNodeExternals()]
}