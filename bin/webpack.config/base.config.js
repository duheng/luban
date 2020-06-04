const webpack = require('webpack')
const TransferWebpackPlugin = require('transfer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

const path = require('path')
const CWD = process.cwd()

const { entry, dllReferencePlugin, loadDllAssets  } = require('../utils/common')
const rules = require('./rules')

const webpackConfig = config => {
  return {
    context: path.join(CWD),
    entry: entry,
    externals: config.externals || {},
    module: rules(),
    resolve: {
      modules: [
        CWD,
        path.resolve(__dirname, '..', '..', 'node_modules'),
        'node_modules',
        'bower_components',
      ],
      alias: {},
      extensions: ['.js', '.vue', '.json', '.jsx', '.scss', '.css', '.less'],
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, '..', '..', 'node_modules')],
      moduleExtensions: ['-loader'],
    },
    plugins: [
       new CleanWebpackPlugin({
           verbose: true,
           cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**/*']
       }),
      new webpack.ProvidePlugin({
        React: 'react',
      }),
      ...dllReferencePlugin(config),
      new AddAssetHtmlPlugin(loadDllAssets(config))
      // new TransferWebpackPlugin(
      //   [
      //     {
      //       from: path.join(config.base, config.assets || 'assets'),
      //       to: path.join(config.assets || 'assets'),
      //     },
      //   ],
      //   path.resolve(CWD),
      // ),
    ],
  }
}
module.exports = webpackConfig