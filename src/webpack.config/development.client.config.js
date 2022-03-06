const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const baseConfig = require('./base.config');
const CreatHtmlPlugin = require('../plugins/creat-html-plugin');
const { config, getTemplate } = require('../utils/common');
const __baseConfig = baseConfig(config);
const CWD = process.cwd();

const buildPath = path.resolve(CWD, config.build);
const timeStamp = new Date().getTime();
const jsName = `js/[name]@[contenthash].js`;
const cssName = 'css/[name]@[contenthash].css';

const plugins = () => {
  let __plugins = [
    ...CreatHtmlPlugin('development', __baseConfig, getTemplate),
    new webpack.HotModuleReplacementPlugin(),
  ];
  return __plugins;
};

module.exports = () => {
  return merge(__baseConfig, {
    output: {
      path: buildPath,
      publicPath: config.static[process.env.NODE_ENV] || '/',
      chunkFilename: jsName,
      filename: jsName,
      clean:true
    },
    target: 'web',
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    performance: {
      hints: false,
    },
    plugins: plugins(),
  });
};
