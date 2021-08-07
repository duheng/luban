const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const baseConfig = require("./base.config");
const CreatHtmlPlugin = require("../plugins/creat-html-plugin");
const { config, getTemplate } = require("../utils/common");
const __baseConfig = baseConfig(config);
const CWD = process.cwd();

const plugins = () => {
  let __plugins = [
  //  ...CreatHtmlPlugin("development", __baseConfig, getTemplate),
  //  new webpack.HotModuleReplacementPlugin(),
  ];
  return __plugins;
};

module.exports = () => {
  return merge(__baseConfig, {
    mode: "development",
    devtool: "none",
    performance: {
      hints: false,
    },
    plugins: plugins(),
  });
};
