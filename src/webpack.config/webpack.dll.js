const path = require('path')
const webpack = require('webpack')
const CWD = process.cwd()
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { config, useDllPath } = require('../utils/common')
const library = '[name]_[chunkhash]'
module.exports = {
    mode: "production",
    entry:{
        ...config.library
    },
    plugins:[
        new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: [useDllPath()]
        }),
        new webpack.DllPlugin({
            context: CWD,
            name: library,
            path: path.join(useDllPath(),'[name].manifest.json'),
        })
    ],
    output:{
        path: useDllPath(),
        filename:'[name]@[chunkhash].js',
        library
    }
}
