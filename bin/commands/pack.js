#!/usr/bin/env node

require("shelljs/global");
const fs = require("fs");
const path = require("path");
const CWD = process.cwd();
const { config } = require("../utils/common");
const {  getWebpackConfig } = require("../utils/webpackConfig");

const webpack = require("webpack");
const pack = (webpackConfig) => {
  return new Promise((resolve, reject) => {
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
    if (options.prod) {
      //生产环境
      process.env.NODE_ENV = "production";
      webpackConfig = getWebpackConfig('production');
    } else {
      process.env.NODE_ENV = "development";
      webpackConfig = getWebpackConfig('development');
    }

    try {
      const {  cacheDllDirectory } = require("../utils/buildCache");
      if (!fs.existsSync(cacheDllDirectory)) {
        await require("./dll")(options);
      }
    } catch (e) {
      console.log("打包dll失败：", e);
    }

  }
  console.log('webpackConfig----', webpackConfig)
 // const wbpackAction = `${webpackCommand} --config ${webpackConfig()} --mode=${process.env.NODE_ENV} --colors`;
  await pack(webpackConfig);
};
