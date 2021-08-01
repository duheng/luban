const path = require("path");
const { devMiddleware, hotMiddleware } = require("koa-webpack-middleware");

module.exports = (config, compile) => {
 return async (ctx, next) => {
	 const __devMiddleware = 
	devMiddleware(compile, {
		noInfo: false,
		hot: false,
		writeToDisk: true,
		publicPath: config.output.publicPath,
		stats: {
			colors: true,
			cached: true,
			exclude: [/node_modules[\\\/]/],
		},
	})
	console.log('__devMiddleware+++',__devMiddleware)
	await __devMiddleware(ctx, next)
	//await next();
}
}
