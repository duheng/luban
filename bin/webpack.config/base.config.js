const webpack = require('webpack')
const TransferWebpackPlugin = require('transfer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const path = require('path')
const CWD = process.cwd()

const { filterFile, entry } = require('../utils/common')
const rules = require('./rules')


const dllReferencePlugin = (config) => {
  const libKeys = Object.keys(config.library)
  return libKeys.map(name=>{
    const __fileName = filterFile(path.join(CWD, config.build, "dll"), `${name}[^.]*\\.manifest\\.json`)
    if (!__fileName) {
        console.error(`没有找到${name}对应的dll manifest.json 文件`);
        return null;
    }
    return new webpack.DllReferencePlugin({
        context:  path.join(CWD),
        manifest: require(path.join(CWD, config.build, "dll", __fileName))
    });
  })
}

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