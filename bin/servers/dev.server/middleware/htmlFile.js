const path = require("path");
const { indexHtml } = require("../util");

module.exports = (config, compile) => {
 return async (ctx, next) => {
	ctx.res.setHeader('Access-Control-Allow-Origin', '*')
	const __instans = [".html", ".htm", ""];
	if (__instans.indexOf(path.extname(ctx.url)) > -1) {
		const __indexHtml = indexHtml(config, ctx.url);
		const filename = path.join(compile.outputPath, __indexHtml);

		const htmlFile = await new Promise(function(resolve, reject) {
			compile.outputFileSystem.readFile(
				filename,
				(err, result) => {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				}
			);
		});
		ctx.type = "html";
		ctx.body = htmlFile;
	}
	await next();
}
}
