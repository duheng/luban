const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseConfig = require("./base.config");
const CreatVersionPlugin = require("../plugins/creat-version-plugin");
const CreatHtmlPlugin = require("../plugins/creat-html-plugin");
const { config , getTemplate } = require("../utils/common");
let __baseConfig = baseConfig(config);
const CWD = process.cwd();

const buildPath = path.resolve(CWD, config.build);

const jsName = "js/[name]@[contenthash:8].js";
const cssName = "css/[name]@[contenthash:8].css";

__baseConfig.module.rules.map((item) => {
  if (/css|sass|less/.test(item.use)) {
    item.use.shift();
    item.use = {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: true,
      },
    };
  }
});

const plugins = () => {
  let __plugins = [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      // filename: 'f_[name].css',
      filename: cssName,
      chunkFilename: cssName,
      ignoreOrder: true, // Enable to remove warnings about conflicting order
    }),
    new webpack.HashedModuleIdsPlugin(),
    ...CreatHtmlPlugin("production", __baseConfig, getTemplate),
  ];
  if(config.chunkver) {
    __plugins.push(new CreatVersionPlugin(config))
  }
  return __plugins;
};

module.exports = () => {
  const __devtool = config['devtool'] || {}
  return merge(__baseConfig, {
    output: {
      path: buildPath,
      publicPath: config.static[process.env.NODE_ENV],
      chunkFilename: jsName,
      filename: jsName,
    },
    mode: "production",
    devtool:  __devtool['production'] || "none",
    plugins: plugins(),
    performance: {
      hints: false,
    },
  });
};
