const fs = require('fs')
const { MODE_NAMES } = require('../utils/constants')

const {  cacheDllDirectory } = require("../../../utils/buildCache");
module.exports = async (ctx, next) => {
    const { modeInfo, mode, projectName } = ctx
    if (modeInfo.modeName === MODE_NAMES.MULTIPLE && (!ctx.projectName || !mode.isProjectName(projectName))) {
        await next()
        return
    } else {
        try {
            if (!fs.existsSync(cacheDllDirectory)) {
                await require("../../../commands/dll").packDll({});
            }
        } catch (e) {
            console.log("打包dll失败：", e);
        }
        await next()
    }
   
}
