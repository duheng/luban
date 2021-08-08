const fs = require('fs')
const { MODE_NAMES } = require('../utils/constants')

const {  cacheDllDirectory } = require("../../../utils/buildCache");
module.exports = async (ctx, next) => {
    const { modeInfo, mode, projectName } = ctx

        try {
            if (!fs.existsSync(cacheDllDirectory) && global.config && Object.keys(global.config).length>0 ) {
                console.log('AAA---',global.config)
                await require("../../../commands/dll").packDll({});
            }
        } catch (e) {
            console.log("打包dll失败：", e);
        }
        await next()
    
   
}
