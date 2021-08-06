const path = require("path");
const fs = require("fs");
const proxy = require("koa-proxies");
const Webpack = require("webpack");
const { devMiddleware, hotMiddleware } = require("koa-webpack-middleware");
const { formatConfig, indexHtml } = require("./util");
const htmlFile = require("./middleware/htmlFile")
const proxyServer = require("./middleware/proxyServer")
const devServer = require("./middleware/devServer")
const staticDir = require("./middleware/staticDir")
const __config = require("../../webpack.config/development.client.config")();
const koa = require("koa");
const app = new koa();

const config = formatConfig(__config);
const compile = Webpack(config);

// const __devMiddleware = devMiddleware(compile, {
// 	noInfo: false,
// 	publicPath: config.output.publicPath,
// 	stats: {
// 		colors: true,
// 		cached: true,
// 		exclude: [/node_modules[\\\/]/],
// 	},
// })
module.exports = (userConfig) => {
	console.log('config---', config.output.publicPath)
	//devServer(config,compile)
	app.use(proxyServer(userConfig));
	// app.use(__devMiddleware);
	// app.use(hotMiddleware(compile));
	app.use(htmlFile(config, compile));
	app.use(devServer(config, compile));
	app.use(staticDir(config.output.publicPath));
	
	app.listen(userConfig.port, () => {
		console.log(
			`🌍 start service at http://${userConfig.host}:${userConfig.port}\n`
		);
	});
};
