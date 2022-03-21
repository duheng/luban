const HtmlWebpackPlugin = require("html-webpack-plugin");
const tmpl = require("blueimp-tmpl");

const HtmlWebpackPluginItem = (name, getTemplate) => {
  return new HtmlWebpackPlugin({
    inject: false, // 禁用自动注入
    filename: `${name}.html`,
    chunks: [`${name}`],
    templateContent: ({ htmlWebpackPlugin }) =>  tmpl(`${getTemplate(name)}`, htmlWebpackPlugin),
  });
};

const CreatHtmlPlugin = (mode, config, getTemplate) => {
  let __htmlPlugin = [];

  if (!!Object.keys(config.entry) && Object.keys(config.entry).length > 0) {
    for (let name in config.entry) {
      __htmlPlugin.push(HtmlWebpackPluginItem(name, getTemplate));
    }
  } else {
    console.error("creat-html-plugin没有找到入口");
  }
  return __htmlPlugin;
};

module.exports = CreatHtmlPlugin;
