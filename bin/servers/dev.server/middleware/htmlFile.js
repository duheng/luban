const path = require("path");
const fs = require("fs");
const { indexHtml } = require("../util");

module.exports = (config, compile) => {
 return async (ctx, next) => {
	ctx.res.setHeader('Access-Control-Allow-Origin', '*')
	const __instans = [".html", ".htm", ""];
	if (__instans.indexOf(path.extname(ctx.url)) > -1) {
		const __indexHtml = indexHtml(config, ctx.url);
		const filename = path.join(compile.outputPath, __indexHtml);
		let htmlFile = null
		console.log('filename----', compile.outputFileSystem)
		if(fs.existsSync(filename) && !!compile.outputFileSystem.readFile) {
			htmlFile = await new Promise(function(resolve, reject) {
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
		} else {
			await next();
		}
		ctx.type = "html";
		ctx.body = htmlFile;
	}else {
		await next();
	}

}
}
