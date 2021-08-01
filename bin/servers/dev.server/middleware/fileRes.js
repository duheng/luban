
const fs = require('fs')
const path = require('path')
const { MODE_NAMES} = require('../../../../ykit3/packages/ykit3-cli/lib/commands/dev-server/utils/constants')
const CWD = process.cwd()
module.exports = (modeInfo) => {
 return async (ctx, next) => {
    const fileType = path.extname( ctx.url ).slice(1);
    const url =  fileType == 'html' ? ctx.url :   '/index.html'
    const isMultiple =  modeInfo.modeName == MODE_NAMES.MULTIPLE  && !!ctx.projectName
   
    if(fileType == 'html' || fileType == '' ) {
        ctx.response.type = 'html';
        const __filePath = isMultiple ? path.join(CWD,ctx.projectName, url) : path.join(CWD, url)
        if(fs.existsSync(__filePath)){
          ctx.body = fs.createReadStream(__filePath);
        } else {
          await next() 
        }
    } else {
        await next() 
    }
  }
}
