const path = require('path')
const webpack = require('webpack')
const CWD = process.cwd()
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { getConfig } = require('../utils/common')
const config = !!global.devServerconfig ? global.devServerconfig : getConfig()
const {  cacheDllDirectory } = require("../utils/buildCache");

const dllPath = cacheDllDirectory
const library = '[name]_[chunkhash]'
const dllConfig = () =>{
    return {
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
            filename:'[name]@[chunkhash].js',
            library
        }
    }
    
}
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
        filename:'[name]@[chunkhash].js',
        library
    }
}

