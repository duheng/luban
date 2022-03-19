const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const FormatProgressPlugin = require("../plugins/format-progress-plugin");
const { useDllPath } = require('../utils/common');

const fs = require("fs");
const path = require("path");
const CWD = process.cwd();

const {
  entry,
  dllReferencePlugin,
  loadDllAssets,
  genAlias,
} = require("../utils/common");
const rules = require("./rules");
const plugins = (config) => {
  let __plugins = [
   // new webpack.ProgressPlugin(FormatProgressPlugin),

    new CleanWebpackPlugin({
      verbose: false,
      cleanOnceBeforeBuildPatterns: ["**/*", "!dll", "!dll/**/*"],
    }),
    // new webpack.ContextReplacementPlugin(/^\.\/locale$/, (context) => {
    //   if (!/\/moment\//.test(context.context)) return;

    //   Object.assign(context, {
    //       regExp: /^\.\/\w+/,
    //       request: '../locale', // resolved relatively
    //   });
    // }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    // new webpack.IgnorePlugin(/\.\/locale/, /moment/,/(en|zh-cn)\.js/),
//   new webpack.ContextReplacementPlugin(
//     // 需要被处理的文件目录位置
//     /moment[\/\\]locale/,
//     // 正则匹配需要被包括进来的文件
//     /(en|zh-cn)\.js/
// ),

    // new webpack.DefinePlugin({
    //   "process.env": {
    //     NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    //   },
    //   API: JSON.stringify(config.api[process.env.NODE_ENV]),
    //   STATIC: JSON.stringify(config.static[process.env.NODE_ENV]),
    // }),
    // new webpack.DefinePlugin({
    //   'process.env':  {
    //     VITE_API_URL: JSON.stringify('https://qa1.kuai.360.cn')
    //   },
    //   'import.meta.env': {
    //     MOZI: JSON.stringify('https://qa1.kuai.360.cn1111')
    //   }
    // }),
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new VueLoaderPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ];
  //fs.existsSync(path.join(CWD, config.build, config.dll)
  if (!!config.library && Object.keys(config.library).length > 0 && fs.existsSync(useDllPath())) {
    __plugins.push(...dllReferencePlugin(config));
    __plugins.push(new AddAssetHtmlPlugin(loadDllAssets(config)));
  }


  const __assetsDir = path.resolve(config.base, config.assets || "assets");
  
  if (fs.existsSync(__assetsDir) && fs.statSync(__assetsDir).isDirectory()) {
    __plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: __assetsDir,
            to: config.assets || "assets"
          }
        ]
      })
    );
  }

  
  return __plugins;
};
const webpackConfig = (config) => {
  return {
    context: path.join(CWD),
    entry: entry,
    externals: config.externals || {},
    target: 'web', 
    module: rules(config),
    resolve: {
      modules: [
        CWD,
        path.resolve(__dirname, "..", "..", "node_modules"),
        "node_modules",
        "bower_components",
      ],
      alias: {
        vue$: "vue/dist/vue.esm.js",
        ...genAlias(path.join(CWD, config.base), config),
      },
      extensions: [".js", ".jsx", ".scss", ".css",  ".vue", ".json", ".less",".ts", ".tsx"],
    },
    resolveLoader: {
      modules: [path.resolve(__dirname, "..", "..", "node_modules")],
      moduleExtensions: ["-loader"],
    },
    plugins: plugins(config),
    optimization: {
      // runtimeChunk: {
      //     name: 'runtime'
      // },
      // splitChunks: {
      //   minSize: 1,
      //   maxAsyncRequests: 100000,
      //   maxInitialRequests: 100000,
      //   cacheGroups: {
      //     default: false,
      //     vendors: false,
      //   },
      // },
      splitChunks: {
        chunks: "all", //指定打包同步加载还是异步加载
       minSize: 80 * 1024, //构建出来的chunk大于80000才会被分割 
      //  minRemainingSize: 0,
       maxSize: 0, //会尝试根据这个大小进行代码分割,0 不限制大小
       minChunks: 3, //制定用了几次才进行代码分割
       maxAsyncRequests: 6,//最大的按需(异步)加载次数，默认为 6。
       maxInitialRequests: 4,
      //  automaticNameDelimiter: "~", //文件生成的连接符
       //name: 'chunk',
      //  hidePathInfo: true,
       cacheGroups: {
         // defaultVendors: {
         //   test: /[\\/]node_modules[\\/]/, //符合组的要求就给构建venders
         //   priority: -10, //优先级用来判断打包到哪个里面去
         //   filename: "vendors", //指定chunks名称
         // },
         default: {
           name:'chunk-common',
           minChunks: 3, //被引用两次就提取出来
           priority:  0,
          reuseExistingChunk: true, //如果当前要提取的模块，在已经在打包生成的js文件中存在，则将重用该模块，而不是把当前要提取的模块打包生成新的js文件。
         },
       },

     },
      // 用模块路劲名字作为webpack的模块名
      namedModules: true,
      minimize: false,
      // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
      minimizer: [
        process.env.NODE_ENV === "production"
          ? new TerserPlugin({
              cache: true,
              // cache: path.resolve(__dirname, 'ugCache'),
              parallel: true,
              extractComments: true, // 提取license文件
              terserOptions: {
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                // mangle: true, // Note `mangle.properties` is `false` by default.
                // ie8: true,
                // safari10: false,
              },
            })
          : null,
      ].filter(Boolean),
    },
  };
};
module.exports = webpackConfig;
