const fs = require('fs')
const {  cacheDllDirectory } = require("../../../utils/buildCache");
module.exports = async (ctx, next) => {
    ctx.printLog({text:'------------------------------'+ctx.projectName})
    try {
        if (!fs.existsSync(cacheDllDirectory)) {
        //    const { packDll } =  require("../../../commands/dll")
            await require("../../../commands/dll").packDll({});
        }
    } catch (e) {
        console.log("打包dll失败：", e);
    }
    await next()
}
