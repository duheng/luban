const path = require('path')
const webpack = require('webpack')
const CWD = process.cwd()
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { config } = require('../utils/common')

const dllPath = path.join(CWD, config.build, config.dll || 'dll')
const library = '[name]_[chunkhash]'

module.exports = {
    mode: "production",
    entry:{
        ...config.library
    },
    plugins:[
        new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: [dllPath]
        }),
        new webpack.DllPlugin({
            context: CWD,
            name: library,
            path: path.join(dllPath,'[name].manifest.json'),
        })
    ],
    output:{
        path: dllPath,
        filename:'[name]_dll@[chunkhash].js',
        library
    }
}
