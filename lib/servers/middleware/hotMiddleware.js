"use strict";const e=require("webpack-hot-middleware"),{PassThrough:t}=require("stream");module.exports=(r,s)=>{const a=e(r,s);return async(e,r)=>{let s=new t;e.body=s,await a(e.req,{write:s.write.bind(s),writeHead:(t,r)=>{e.status=t,e.set(r)}},r)}};