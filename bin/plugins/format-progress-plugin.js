const readline = require('readline');

const WriteProgress = (percentage, message) => {
    // 删除光标所在行
     readline.clearLine(process.stdout, 0)
    // 移动光标到行首
     readline.cursorTo(process.stdout, 0)
     
    if(percentage < 1) {
        const __log = `[luban] ${(percentage * 100).toFixed(0)}% ${message}`
        process.stdout.write(__log,'utf-8');
    }
    
}

module.exports = WriteProgress;