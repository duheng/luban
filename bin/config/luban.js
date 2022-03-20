module.exports = {
  "host": "127.0.0.1",
  "port": "3001",
  "platform": "react",
  "ui_plug":"antd",
  "base": "src",
  "build": "prd",
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
  "modifyWebpackConfig": (baseConfig, webpack) => {
    return baseConfig;
  }
}
