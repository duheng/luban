const path = require('path')
const Webpack = require('webpack');
const { devMiddleware, hotMiddleware } = require('koa-webpack-middleware')
const koaWebpack = require('koa-webpack');

const webpackDevMiddleware = require("webpack-dev-middleware")
const webpackHotMiddleware = require("webpack-Hot-middleware")
const __config = require('../webpack.config/development.client.config')();

const express = require("express")
const koa = require('koa');

const app = new koa();
const static = require('koa-static');

const formatConfig = (config) => {
  let __config = {...config}
  let __entry = __config.entry
  let __entryNew = {}
  for(let i in __entry){
    __entryNew[i] = [__entry[i],'webpack-hot-middleware/client?reload=false&path=/__webpack_hmr&timeout=20000']
  }
  __config.entry = __entryNew
  return __config
}

const config = formatConfig(__config)
const compiler = Webpack(config);
// const middleware =  koaWebpack({ config });

app.use(async (ctx, next) => {
  await koaWebpack({ compiler });
  next()
})
//
// app.use(
//   devMiddleware(compile, {
//     noInfo: false,
//     publicPath: config.output.publicPath,
//     stats: {
//       colors: true,
//       cached: false,
//       exclude: [/node_modules[\\\/]/],
//     },
//   })
// )
//
// app.use( //重定向到首页，
//   async (ctx, next) => {
//     const index_name = 'main.html'
//     const filename = path.join(compile.outputPath, index_name);
//     const htmlFile = await (new Promise(function(resolve, reject){
//         compile.outputFileSystem.readFile(filename, (err, result) => {
//           if (err){
//             reject(err);
//           }else{
//             resolve(result);
//           }
//         });
//      }))
//      ctx.type = 'html';
//      ctx.body = htmlFile;
//      await next()
//   }
//
//  )
//console.log('config----',config)
// const devMiddleware = require('./devMiddleware');
// const hotMiddleware = require('./hotMiddleware');

//app.use(static(config.output.path));

// app.use(webpackDevMiddleware(compile, {
//     publicPath: config.output.publicPath,
//     quiet: true //向控制台显示任何内容
// }));
// //
// app.use(webpackHotMiddleware(compile,{
//    log: false,
//    heartbeat: 2000,
// }));
//

console.log('publicPath------', config.output.path)
// app.use(devMiddleware(compile, {
//     noInfo: true,
//     publicPath: config.output.publicPath
// }));

//
// app.use(hotMiddleware(compile,{}));
//
 //app.use(express.static(config.output.path))

// app.use( //重定向到首页，
//   async (ctx, next) => {
//
//
//     let __IndexName = ''
//     const __ctxpage = ctx.url.split('/').pop().split('.')[0]
//       console.log('ctx---',entrys.indexOf(__ctxpage) )
//     if(typeof(config.entry) == 'object') {
//
//       if(entrys.length == 1) {
//         __IndexName = entrys[0]
//       } else {
//
//       }
//
//     } else {
//       console.warn('您没有设置配置文件中entry(入口文件)\n,系统将以多页面处理')
//     }
//     let fileName = path.join(compile.outputPath, `${__IndexName}.html`);
//
//     const htmlFile = await (new Promise(function(resolve, reject){
//           compile.outputFileSystem.readFile(fileName, (err, result) => {
//             if (err){
//               reject(err);
//             }else{
//               resolve(result);
//             }
//           });
//     }))
//     ctx.type = 'html';
//     ctx.body = htmlFile;
//     await next()
//   }
// )

app.listen(3000, () => {
    console.log('Example app listening om port 3000!\n');
});
