const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const FormatProgressPlugin = require("../plugins/format-progress-plugin");
const { useDllPath } = require('../utils/common');
const { useCache, terserCacheDirectory } = require('../utils/buildCache');
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
    new webpack.ProgressPlugin(FormatProgressPlugin),
    new CleanWebpackPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
      API: JSON.stringify(config.api[process.env.NODE_ENV]),
      STATIC: JSON.stringify(config.static[process.env.NODE_ENV]),
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ];

  if(config.platform == 'react') {
    __plugins.push(new webpack.ProvidePlugin({
      React: 'react',
    }));
  } else if(config.platform == 'vue') {
    __plugins.push(new VueLoaderPlugin());
  }

  if (!!config.library && Object.keys(config.library).length > 0 && fs.existsSync(useDllPath())) {
    __plugins.push(...dllReferencePlugin(config));
    __plugins.push(new AddAssetHtmlPlugin(loadDllAssets(config)));
  }

  const __assetsDir = path.resolve(config.base, config.assets || "assets");
  const copyPattern = []
  if (fs.existsSync(__assetsDir) && fs.statSync(__assetsDir).isDirectory()) {
    copyPattern.push({
      from: __assetsDir,
      to: config.assets || "assets"
    })
  }

  if(config.copy instanceof Array && config.copy.length > 0) {
    copyPattern.push(...config.copy)
  }
  __plugins.push(
    new CopyWebpackPlugin({
      patterns: [...copyPattern]
    })
  );

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
      ],
      alias: {
        ...genAlias(path.join(CWD, config.base), config),
      },
      extensions: [".js", ".jsx", ".scss", ".css", ".less",".ts", ".tsx",  ".vue", ".json"],
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
      splitChunks: {
        minSize: 1,
        maxAsyncRequests: 100000,
        maxInitialRequests: 100000,
        cacheGroups: {
          default: false,
          vendors: false,
        },
      },
      // 用模块路劲名字作为webpack的模块名
      namedModules: true,
      minimize: false,
      // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
      minimizer: [
        process.env.NODE_ENV === "production"
          ? new TerserPlugin({
              minify: TerserPlugin.esbuildMinify,
              exclude: /node_modules|dll|.luban-cache/ ,
              cache: useCache ? terserCacheDirectory : false,
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
