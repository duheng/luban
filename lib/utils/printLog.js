"use strict";const e=require("chalk"),o=require("readline");module.exports={printLog:r=>{o.clearLine(process.stdout,0),o.cursorTo(process.stdout,0);const s=`${e.hex("5bc2e7").bold("[luban]")} ${e.hex("6980c5").bold(r)}`;process.stdout.write(s,"utf-8")}};