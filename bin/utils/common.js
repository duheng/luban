const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const confman = require("confman");
const CWD = process.cwd();
const { printLog, getUtilName } = require('./base');
const getConfig = () => {
    const __name = getUtilName()
    const __projectName = global.projectName ? `${global.projectName}/` : ''
    const __config =  confman.load(`${CWD}/${__projectName}${__name}`);
    if(Object.keys(__config).length > 0) {
      return __config;
    } else {
      printLog({type:'error',text:`没有加载到配置文件${__name}.*`})
    }
}

const getWebpackCommand = () => {
  //注: webpack4之后需 webpack命令被抽取到webpack-cli中，如果webpack-cli安装在本地则需要用当前node_modules中的webpack才能找到cli
  const __webpack = path.resolve(__dirname, '..', '..', 'node_modules', '.bin', 'webpack')
  const webpackCommand = fs.existsSync(__webpack) ? __webpack : 'webpack'
  return webpackCommand
}

const getTemplate = () => {
  const __path = path.join(CWD, "template.html");
  let templ = "";
  if (fs.existsSync(__path)) {
    templ = fs.readFileSync(__path, "utf8");
  } else {
    printLog({text:'没有在您的项目中加载到模版文件，将使用默认模版'})
    templ = fs.readFileSync(
      path.join(__dirname, "..", "config", "template.html"),
      "utf8"
    );
  }
  return templ;
}

const filterFile = (dir, pattern) => {
  try {
    if (!fs.existsSync(dir)) {
      return false;
    }
  } catch (e) {
    return false;
  }
  const filenames = fs.readdirSync(dir);

  for (let i = 0; i < filenames.length; i++) {
    if (new RegExp(pattern).test(filenames[i])) {
      return filenames[i];
    }
  }
  return false;
};

const getEntry = () => {
  const __config = getConfig();
  if (typeof __config.entry != "object") {
    return printLog({type:'error',text:'entry必须object类型\n 例如："entry": {"main":"./src/pages/index.js"}\r\n'})
  }
  if (Object.keys(__config.entry).length > 0) {
    return __config.entry;
  } else {
    const pageDir = path.join(CWD, __config.base, __config.pages);
    try {
      if (!fs.existsSync(pageDir)) {
        printLog({type:'error',text:'请设置项目配置文件入口entry字段'})
        return {};
      }
    } catch (e) {
      printLog({type:'error',text:'请设置项目配置文件入口entry字段'})
      return {};
    }

    const loadPageDir = fs.readdirSync(pageDir);
    let __entry = {};
    for (let i = 0; i < loadPageDir.length; i++) { // 如果没有配置entry字段，则以pages下具体页面文件夹下index.js为入口页面，可能是多个入口页面
      const __pageDirItem = path.join(pageDir, loadPageDir[i]);
      if (fs.statSync(__pageDirItem).isDirectory()) {
        __entry[
          loadPageDir[i]
        ] = `./${__config.base}/${__config.pages}/${loadPageDir[i]}/index.js`;
      }
    }
    return __entry;
  }
};

const dllReferencePlugin = (config) => {
  const libKeys = Object.keys(config.library);
  return libKeys.map((name) => {
    const __fileName = filterFile(
      path.join(CWD, config.build, config.dll),
      `${name}[^.]*\\.manifest\\.json`
    );
    if (!__fileName) {
      printLog({type:'error',text:`没有找到${name}对应的dll manifest.json 文件`})
      return null;
    }
    return new webpack.DllReferencePlugin({
      context: path.join(CWD),
      manifest: require(path.join(CWD, config.build, config.dll, __fileName)),
    });
  });
};

const loadDllAssets = (config) => {
  return fs
    .readdirSync(path.join(CWD, config.build, config.dll))
    .filter((filename) => filename.match(/.js$/))
    .map((filename) => {
      return {
        filepath: path.join(CWD, config.build, config.dll, filename),
        outputPath: "dll",
        publicPath: `${config.static[process.env.NODE_ENV]}/dll`,
      };
    });
};

const genAlias = (projectDir, config) => {
  const __names = fs.readdirSync(projectDir);
  const __alias = config.alias;
  let map = {};

  __names.forEach((name) => {
    map[name] = path.resolve(projectDir, name);
  });

  if (!!__alias && typeof __alias == "object") {
    Object.keys(__alias).forEach((name) => {
      map[name] = path.join(CWD,__alias[name]) 
    });
  }
  return { ...map };
};

const isContainFile = (dir, pattern) => {
  try {
      if (!fs.statSync(dir).isDirectory()) {
          return false
      }
  } catch (e) {
      return false
  }
  const filenames = fs.readdirSync(dir)
  for (let i = 0; i < filenames.length; i++) {
      if (new RegExp(pattern).test(filenames[i])) {
          return filenames[i]
      }
  }
  return false
}

module.exports = {
  webpackCommand: getWebpackCommand(),
  config: getConfig(),
  getConfig,
  entry: getEntry(),
  dllReferencePlugin,
  loadDllAssets,
  genAlias,
  getTemplate,
  isContainFile,
};
