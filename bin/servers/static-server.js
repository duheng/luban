const path = require("path");
const fs = require("fs");
const { config } = require("../utils/common");

const koa = require("koa");
const app = new koa();
const koaStatic = require('koa-static');

const CWD = process.cwd();
const outputPath = path.join(CWD, config.build)

app.use(koaStatic(outputPath))

const indexHtml = (url) => {
  // 页面重定向匹配
  const entrys = Object.keys(config.entry);
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
  async (ctx, next) => {
    const __indexHtml = indexHtml(ctx.url);
    const filename = path.join(outputPath, __indexHtml);
    ctx.type = "html";
    ctx.body =  fs.createReadStream(filename);
    await next();
  }
);

app.listen(3000, () => {
  console.log("app listening on port 3000!\n");
});
