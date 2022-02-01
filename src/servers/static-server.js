const path = require("path");
const fs = require("fs");
const express = require("express");
const app = express();
const CWD = process.cwd();


module.exports = (targetConfig) => {

  const outputPath = path.join(CWD, targetConfig.build)
  app.use(express.static(outputPath));

  const indexHtml = (url) => {
    // 页面重定向匹配
    const entrys = Object.keys(targetConfig.entry);
    let __indexname = "";
    if (entrys.length == 1) {
      // 单页面应用只有一个入口，读取第一个入口作为路由入口页面，起着承载路由的作用
      __indexname = entrys[0];
    } else {
      // 多页面需要在系统入口文件中匹配请求过来的页面，没有匹配到则返回404页面
      const __reqpage = url
        .split("/")
        .pop()
        .split(".")[0];
      __indexname = entrys.indexOf(__reqpage) > -1 ? __reqpage : "404";
    }
    return `${__indexname}.html`;
  };

  app.use(
    //重定向到首页，
    async (req,res, next) => {
      const __indexHtml = indexHtml(req.url);
      const filename = path.join(outputPath, __indexHtml);
     // ctx.body =  fs.createReadStream(filename);
      res.set('content-type', 'text/html')
      res.send(filename)
      res.end()
    }
  );

  app.listen(targetConfig.port, () => {
    console.log(`🌍 start service at http://${targetConfig.host}:${targetConfig.port}\n`);
  });

}
