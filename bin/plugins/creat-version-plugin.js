"use strict";const e=require("path"),s=require("fs"),i=require("shelljs"),n=/^([^\@]*)\@([^\.]+)(\.(js|css))$/,t=require("crypto");module.exports=class{constructor(e){this.config=e}apply(e){e.hooks.done.tapPromise("creatVersion",(async e=>{const s=Object.keys(e.compilation.assets);await this.writeFilemappingsion(s)}))}async writeFilemappingsion(r){const{base:o,build:c}=this.config,a=this.config.static[process.env.NODE_ENV],l=e.parse(e.resolve()).name;r.forEach((t=>{if(/\.(js|css)/.test(t)){const r=t.match(n);if(r){const n=r[1]+r[3],t=r[2],o=e.resolve(`${this.config.base}/ver`,n+".ver"),c=e.dirname(o);s.existsSync(c)||i.mkdir("-p",c),s.writeFileSync(o,t,"utf-8")}}}));const p=[],h=[];try{const i=i=>{const n=e.basename(i);if("chunk.json.ver"===n||"versions.mapping"===n||!n.endsWith(".ver"))return;const t=s.readFileSync(i,{encoding:"UTF-8"}),r=n.replace(/\.ver$/,""),o="."+r.split(".").pop(),u=r.split(".").slice(0,-1).join(".");p.push(`${i.slice(e.resolve("ver").length+1)}#${t}`),h.push(`${a}${l}/${c}/${u}@${t}${o}`)},n=e.resolve(`${o}/ver`),t=(n,r)=>{s.statSync(n).isDirectory()?s.readdirSync(n).forEach((o=>{const c=e.resolve(n,o);s.statSync(c).isDirectory()?t(c,(e=>{})):(i(c),"function"==typeof r&&r(c))})):i(n)};t(n)}catch(e){console.log(e)}const u=(v=p.join("\n"),t.createHash("md5").update(v).digest("hex"));var v;s.writeFileSync(e.resolve(`${o}/ver`,"chunk.json.ver"),u,"utf-8"),p.push(`chunk.json#${u}`),s.writeFileSync(e.resolve(`${o}/ver`,"versions.mapping"),p.join("\n"),"utf-8"),s.writeFileSync(e.resolve(`${c}/chunk@${u}.json`),JSON.stringify(h),"utf-8")}};
