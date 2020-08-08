const path = require('path')
const Webpack = require('webpack');
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware')
const __config = require('../webpack.config/development.client.config')();

const koa = require('koa');
const app = new koa();

const formatConfig = (config) => {
  let __config = {...config}
  let __entry = __config.entry
  let __entryNew = {}
  if(typeof(__entry) != 'object') {
    throw new Error('entry必须object类型\n 例如："entry": {"main":"./src/pages/index.js"}\r\n')
  }
  for(let i in __entry){
    __entryNew[i] = [__entry[i],'webpack-hot-middleware/client?reload=false&path=/__webpack_hmr&timeout=20000']
  }
  __config.entry = __entryNew
  return __config
}

const indexHtml = (url) => { // 页面重定向匹配
   const entrys = Object.keys(config.entry)
   let __indexname = ''
   if(entrys.length == 1) { // 单页面应用只有一个入口，读取第一个入口作为路由入口页面，起着承载路由的作用
     __indexname = entrys[0]
   } else { // 多页面需要在系统入口文件中匹配请求过来的页面，没有匹配到则返回404页面
     const __reqpage = url.split('/').pop().split('.')[0]
     __indexname = entrys.indexOf(__reqpage) > -1 ? __reqpage : '404'
   }
   return `${__indexname}.html`
}

const config = formatConfig(__config)
const compile = Webpack(config);

app.use(
  devMiddleware(compile, {
    noInfo: false,
    publicPath: config.output.publicPath,
    stats: {
      colors: true,
      cached: true,
      exclude: [/node_modules[\\\/]/],
    },
  })
)

app.use(hotMiddleware(compile))

app.use( //重定向到首页，
  async (ctx, next) => {
    const __indexHtml = indexHtml(ctx.url)
    const filename = path.join(compile.outputPath, __indexHtml);
    const htmlFile = await (new Promise(function(resolve, reject){
        compile.outputFileSystem.readFile(filename, (err, result) => {
          if (err){
            reject(err);
          }else{
            resolve(result);
          }
        });
     }))
     ctx.type = 'html';
     ctx.body = htmlFile;
     await next()
  }
)

app.listen(3000, () => {
    console.log('Example app listening om port 3000!\n');
});
