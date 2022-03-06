
require("shelljs/global");
const fs = require("fs");
const path = require("path");
const CWD = process.cwd();
const { config, useDllPath } = require("../utils/common");
const { changeCache, setCacheVersion } = require("../utils/clearCache");
const { isChangeDll } = require("../utils/dllPitch");
const {  getWebpackConfig } = require("../utils/webpackConfig");
const { printLog } = require('../utils/printLog')
const webpack = require("webpack");
const pack = (webpackConfig) => {
  return new Promise((resolve, reject) => {
    printLog('Building project')
    webpack({...webpackConfig}, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        return;
      }
    
      const info = stats.toJson();
    
      if (stats.hasErrors()) {
        console.error(info.errors);
      }
    
      if (stats.hasWarnings()) {
        console.warn(info.warnings);
      }
      printLog('Build project complete')
      resolve();
    });
    
  });
};

module.exports = async (options) => {
  let webpackConfig = null;
  
  if (options.node) {
    process.env.NODE_ENV = "development";
    webpackConfig = getWebpackConfig('server');
  } else {
    try {
      const _useDllPath = useDllPath()
      if (isChangeDll(_useDllPath, config)) {
        await require("./dll")(options);
      }
    } catch (e) {
      console.log("打包dll失败：", e);
    }

    if (options.prod) {
      //生产环境
      process.env.NODE_ENV = "production";
      webpackConfig = getWebpackConfig('production');
    } else {
      process.env.NODE_ENV = "development";
      webpackConfig = getWebpackConfig('development');
    }
  }
  
  if(options.min) {
    webpackConfig.optimization.minimize = true
  }
  
 // const wbpackAction = `${webpackCommand} --config ${webpackConfig()} --mode=${process.env.NODE_ENV} --colors`;
  changeCache(process.env.NODE_ENV) // 检查缓存
  await pack(webpackConfig);
  setCacheVersion(process.env.NODE_ENV) // 设置缓存版本
};
