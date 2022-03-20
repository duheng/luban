module.exports = {
  "host": "0.0.0.0",
  "port": "3000",
  "platform": "react",
  "ui_plug":"antd",
  "base": "src",
  "build": "dist",
  "dll": "dll",
  "static": {
    "development": "",
    "production": "//q.qunarzz.com/"
  },
  "api": {
    "development": "",
    "production": "//api.luban.com/"
  },
  "entry": {'main':'./src/pages/index.js'},
  "library": {
     "vendor": ['react', 'react-dom']
  },
  "alias": {},
  "devtool": "source-map",
  "css_modules": false,
  "proxy": [],
  "pages": "pages",
  "components": "components",
  "scss": "scss",
  "assets": "assets",
  "base64_image_limit": 10240,
  "cache": true,
  "chunkver": false, // 生成构建后各文件的版本号
  "chunkantd": true, // antd动态导入
  "modifyWebpackConfig": (baseConfig, webpack) => {
    return baseConfig;
  }
}
