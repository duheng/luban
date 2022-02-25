"use strict";const e=require("path"),r=require("fs"),{createProxyMiddleware:t}=require("http-proxy-middleware"),o=require("webpack"),n=require("../webpack.config/development.client.config")(),a=require("express"),l=require("connect-history-api-fallback"),i=a(),c=(t=>{let o={...t},n=o.entry,a={};if("object"!=typeof n)throw new Error('entry必须object类型\n 例如："entry": {"main":"./src/pages/index.js"}\r\n');for(let t in n){if(Array.isArray(n[t]))throw new Error('entry必须object类型\n 例如："entry": {"main":"./src/pages/index.js"}\r\n');try{const o=String(r.readFileSync(e.resolve(n[t])));/\bmodule.hot\b/.test(o)||(console.log("\n系统检测到入口文件缺少热更新必须的module.hot，系统已为您自动添加\n"),r.appendFileSync(e.resolve(n[t]),";if (module.hot) {module.hot.accept()}; "))}catch(e){throw`入口文件加载失败，请检查入口文件\r\n${e}`}a[t]=[n[t],"webpack-hot-middleware/client?reload=false&path=/__webpack_hmr&timeout=20000"]}return o.entry=a,o})(n),s=o(c);module.exports=e=>{console.log();const r=require("webpack-dev-middleware")(s);i.use(r),i.use(l()),r.waitUntilValid((()=>{i.use(require("webpack-hot-middleware")(s)),console.log(),(e=>{const r=e.proxy;r&&r.length>0&&(console.log(`[luban] 已为您初始化以下 ${r.length} 个代理 \n`),r.map((e=>{console.log(`${e.path} -> ${e.target}/${e.path}\n`),i.use(e.path,t({target:e.target,changeOrigin:!1,logs:!1}))})))})(e),i.listen(e.port,(()=>{console.log(`🌍 start service at http://${e.host}:${e.port}\n`)}))}))};