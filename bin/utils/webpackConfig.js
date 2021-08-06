const { config } = require('./common');
const webpackConfig = {
  development: '../webpack.config/development.client.config',
  production: '../webpack.config/production.client.config',
  server: '../webpack.config/server.config'
}
// 合并用户自定义的webpack配置
const getWebpackConfig = (mode = 'development') => {
  const __webpackConfig = require(webpackConfig[mode])()
  if (config.modifyWebpackConfig) {
   // console.log("AS---", config.modifyWebpackConfig(__webpackConfig))
    return {...__webpackConfig, ...config.modifyWebpackConfig(__webpackConfig)};
  } else {
    return __webpackConfig
  }
};

module.exports = {
  getWebpackConfig
};
