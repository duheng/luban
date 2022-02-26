const path = require("path");
const fs = require("fs");
const { createProxyMiddleware } = require('http-proxy-middleware');
const Webpack = require("webpack");
const __config = require("../webpack.config/development.client.config")();
const express = require("express");
const history = require('connect-history-api-fallback');
const app = express();
const formatConfig = (config) => {
	let __config = { ...config };
	let __entry = __config.entry;
	let __entryNew = {};
	if (typeof __entry !== "object") {
		throw new Error(
			'entry必须object类型\n 例如："entry": {"main":"./src/pages/index.js"}\r\n'
		);
	}

	for (let i in __entry) {
		if (Array.isArray(__entry[i])) {
			throw new Error(
				'entry必须object类型\n 例如："entry": {"main":"./src/pages/index.js"}\r\n'
			);
		}
		try {
			const __entryFile = String(
				fs.readFileSync(path.resolve(__entry[i]))
			);
			if (!/\bmodule.hot\b/.test(__entryFile)) {
				console.log(
					"\n系统检测到入口文件缺少热更新必须的module.hot，系统已为您自动添加\n"
				);
				fs.appendFileSync(
					path.resolve(__entry[i]),
					`;if (module.hot) {module.hot.accept()}; `
				);
			}
		} catch (err) {
			throw `入口文件加载失败，请检查入口文件\r\n${err}`;
		}

		__entryNew[i] = [
			__entry[i],
			"webpack-hot-middleware/client?reload=false&path=/__webpack_hmr&timeout=20000",
		];
	}

	__config.entry = __entryNew;
	return __config;
};

const indexHtml = (url) => {
	// 页面重定向匹配
	const entrys = Object.keys(config.entry);
	let __indexname = "";
	if (entrys.length == 1) {
		// 单页面应用只有一个入口，读取第一个入口作为路由入口页面，起着承载路由的作用
		__indexname = entrys[0];
	} else {
		__indexname = entrys[0];
		// 多页面需要在系统入口文件中匹配请求过来的页面，没有匹配到则返回404页面
		const __reqpage = url
			.split("/")
			.pop()
			.split(".")[0];
		__indexname = entrys.indexOf(__reqpage) > -1 ? __reqpage : "404";
	}
	return `${__indexname}.html`;
};

const proxyAction = (targetConfig) => {
	const __proxy = targetConfig.proxy;
	if (__proxy && __proxy.length > 0) {
		console.log(`[luban] 已为您初始化以下 ${__proxy.length} 个代理 \n`);
		__proxy.map((item) => {
			console.log(`${item.path} -> ${item.target}/${item.path}\n`);
			app.use(item.path, createProxyMiddleware({ target: item.target, changeOrigin: false,logs: false, }));
		});
	}
}

const config = formatConfig(__config);
const compile = Webpack(config);
module.exports = (targetConfig) => {
	console.log();
	const devMiddleware = require("webpack-dev-middleware")(compile);
	app.use(devMiddleware);
	app.use(history())
	devMiddleware.waitUntilValid(() => {
		app.use(require("webpack-hot-middleware")(compile));
		console.log();
		proxyAction(targetConfig);
		app.listen(targetConfig.port, () => {
			console.log(
				`🌍 start service at http://${targetConfig.host}:${targetConfig.port}\n`
			);
		});
	})
	// compile.hooks.done.tap("done", stats => {
	// 	const info = stats.toJson();
	// 	if (stats.hasWarnings()) {
	// 		console.warn(info.warnings);
	// 	}
	
	// 	if (stats.hasErrors()) {
	// 		console.error(info.errors);
	// 		return;
	// 	}
	// 	//console.log("打包完成");
	// });  
};
