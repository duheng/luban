const path = require('path')
const webpack = require('webpack')
const CWD = process.cwd()
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { config } = require('../utils/common')
const { cacheDllDirectory } =  require("../utils/buildCache");
const library = '[name]_[fullhash]'
console.log('config------', config.library)
module.exports = {
    mode: "production",
    entry:{
        ...config.library
    },
    plugins:[
        new CleanWebpackPlugin({
          cleanOnceBeforeBuildPatterns: [cacheDllDirectory]
        }),
        new webpack.DllPlugin({
            context: CWD,
            name: library,
            path: path.join(cacheDllDirectory,'[name].manifest.json'),
        })
    ],
    output:{
        path: cacheDllDirectory,
        filename:'[name]_dll@[fullhash].js',
        library
    }
}
