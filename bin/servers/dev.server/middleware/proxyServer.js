const proxy = require("koa-proxies");

module.exports = (userConfig) => {
 return async (ctx, next) => {
	const __proxy = userConfig.proxy;
	if (__proxy && __proxy.length > 0) {
		console.log(`[luban] 已为您初始化以下 ${__proxy.length} 个代理 \n`);
		__proxy.map((item) => {
			console.log(`${item.path} -> ${item.target}/${item.path}\n`);
			app.use(
				proxy(item.path, {
					target: item.target,
					changeOrigin: true,
					rewrite: path,
					logs: true,
				})
			);
		});
	}
	await next();
}
}
