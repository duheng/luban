const fs = require('fs')
const { MODE_NAMES } = require('../utils/constants')

const {  cacheDllDirectory } = require("../../../utils/buildCache");
module.exports = async (ctx, next) => {
    try {
        if (!fs.existsSync(cacheDllDirectory) && global.devServerconfig && Object.keys(global.devServerconfig).length>0 ) {
            await require("../../../commands/dll").packDll({});
        }
    } catch (e) {
        console.log("打包dll失败：", e);
    }
    await next()
   
}
