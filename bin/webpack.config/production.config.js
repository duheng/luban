const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CreatVersionPlugin = require('../plugins/creat-version-plugin')
const baseConfig = require('./base.config')

const { config } = require('../utils/common')

const path = require('path')
const CWD = process.cwd()

const jsName  = 'js/[name]@[chunkhash].js'
const cssName = 'css/[name]@[chunkhash].css'


const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      MODE: JSON.stringify(process.env.MODE),
      NODE_ENV: JSON.stringify('production'),
    },
    API: JSON.stringify(config.api[process.env.MODE]),
    STATIC: JSON.stringify(config.static[process.env.MODE]),
  }),
  new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      // filename: 'f_[name].css',
      filename: cssName,
      chunkFilename: cssName,
      ignoreOrder: true // Enable to remove warnings about conflicting order
  }),
  new CreatVersionPlugin()
]

let __baseConfig = baseConfig(config)

__baseConfig.module.rules.map(item => {
  if (/css|sass|less/.test(item.use)) {
    item.use.shift()
    item.use = {
        loader: MiniCssExtractPlugin.loader,
        options: {
            hmr: true
        }
    }
  }
})

module.exports = () => {
  return merge(__baseConfig, {
    output: {
      path: path.resolve(CWD, config.build),
      publicPath: config.static[process.env.MODE],
      chunkFilename: 'js/[name]-[chunkhash:8].js',
      filename: jsName
    },
    mode: 'production',
    devtool: 'source-map',
    plugins,
    performance: {
      hints: false,
    },
  })
}
