const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const baseConfig = require("./base.config");
const CreatHtmlPlugin = require("../plugins/creat-html-plugin");
const { config, getTemplate } = require("../utils/common");
const __baseConfig = baseConfig(config);
const CWD = process.cwd();

const buildPath = path.resolve(CWD, config.build);

const jsName = "js/[name].js";
const cssName = "css/[name].css";

const plugins = () => {
  let __plugins = [
    ...CreatHtmlPlugin("development", __baseConfig, getTemplate),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ];
  return __plugins;
};

module.exports = () => {
  const __devtool = config['devtool'] || {}
  return merge(__baseConfig, {
    output: {
      path: buildPath,
      publicPath: config.static[process.env.NODE_ENV] || '/',
      chunkFilename: jsName,
      filename: jsName,
    },
    mode: "development",
    devtool: __devtool['development'] || 'none',
    performance: {
      hints: false,
    },
    plugins: plugins(),
  });
};
