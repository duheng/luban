"use strict";const e=require("html-webpack-plugin"),t=require("blueimp-tmpl"),l=(l,n)=>new e({inject:!1,filename:`${l}.html`,chunks:[`${l}`],templateContent:({htmlWebpackPlugin:e})=>t(`${n(l)}`,e)});module.exports=(e,t,n)=>{let r=[];if(Object.keys(t.entry)&&Object.keys(t.entry).length>0)for(let e in t.entry)r.push(l(e,n));else console.error("creat-html-plugin没有找到入口");return r};