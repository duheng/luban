"use strict";require("shelljs/global");const e=require("inquirer"),{printLog:a}=require("./base");module.exports={selectTmpl:async()=>{const r=await e.prompt([{type:"list",message:"请选择一个项目类型:",name:"tmpl",default:"green",prefix:"☆☆☆☆☆",suffix:"☆☆☆☆☆",choices:[{name:"egg+react+redux的前后端结合的ssr项目(推荐)",value:"Egg_React_Redux"},{name:"react+redux+antd的前后端结合的client项目",value:"React_Redux_Antd"},{name:"react+mobx的client项目",value:"React_Mobx"},{name:"koa+react+redux的前后端结合的ssr项目",value:"Koa_React_Redux"},{name:"react项目",value:"React"},{name:"react+redux的项目",value:"React_Redux"},{name:"Vue项目",value:"Vue"}],filter:e=>e.toLowerCase()}]);if(r)return r.tmpl;a({type:"error",text:"selectTmpl出错"})},askCurrentDir:async()=>{const r=await e.prompt([{type:"confirm",message:"是否以当前目录作为项目根目录:",name:"iscur"}]);if(r)return r.iscur;a({type:"error",text:"askCurrentDir函数出错"})},askProductName:async()=>{const r=await e.prompt([{type:"input",message:"请输入项目名称:",name:"name"}]);if(r)return r.name;a({type:"error",text:"askProductName函数出错"})},askReplayDir:async r=>{const t=await e.prompt([{type:"confirm",message:`检测到您的目录已存在${r}文件夹，是否替换:`,name:"replay"}]);if(t)return t.replay;a({type:"error",text:"askReplayDir函数出错"})}};