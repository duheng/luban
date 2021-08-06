const path = require("path");
const { devMiddleware, hotMiddleware } = require("koa-webpack-middleware");

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

function transformRequestUrlHash (url) {
    return url.replace(/@[^.]*\./, '@dev.')
}

module.exports = (config, compile) => {
 return async (ctx, next) => {
console.log('AAAAA')
    ctx.req.url = transformRequestUrlHash(ctx.req.url)
	
	const devServerMiddleware = webpackDevMiddleware(compile, {
		logLevel: 'debug',
		writeToDisk: true,
		watchOptions: {
			ignored: /node_modules|prd|dist|.qcache/
		},
	})

	// {
	// 	logLevel: 'debug',
	// 	writeToDisk: true,
	// 	hot: false,
	// 	lazy: false,
	// 	publicPath: config.output.publicPath,
	// 	watchOptions: {
	// 		poll: true,
	// 		// aggregateTimeout: 200000,
	// 		 ignored: /node_modules|prd|.qcache/
	// 	},
	// 	reporter: (middlewareOptions, { stats, log }) => {
	// 	   // log.log(stats)
	// 	  // console.log(ctx.req.url )
	// 	   // fs.existsSync(DllDir) && shell.cp('-rf', DllDir+'/*', webpackConfig.output.path)
	// 	   // webpackStatsFormatter(stats, logger.info.bind(logger))
	// 	}
	// }
	await devServerMiddleware(ctx.req, ctx.res, next)
	//  const __devMiddleware = 
	// devMiddleware(compile, {
	// 	noInfo: false,
	// 	hot: false,
	// 	writeToDisk: true,
	// 	publicPath: config.output.publicPath,
	// 	stats: {
	// 		colors: true,
	// 		cached: true,
	// 		exclude: [/node_modules[\\\/]/],
	// 	},
	// })
	// console.log('__devMiddleware+++',__devMiddleware)
	// await __devMiddleware(ctx, next)
	//await next();
}
}
