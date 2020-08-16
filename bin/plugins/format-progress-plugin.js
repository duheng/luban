const readline = require('readline');
const chalk = require('chalk');
const WriteProgress = (percentage, message) => {
    // 删除光标所在行
     readline.clearLine(process.stdout, 0)
    // 移动光标到行首
     readline.cursorTo(process.stdout, 0)
     const __percentage = `${(percentage * 100).toFixed(0)}%`
    if(percentage == 1) {
        process.stdout.write(`${chalk.hex('5bc2e7').bold('[luban]')} ${chalk.hex('70dfdf').bold('100%')} ${chalk.hex('6980c5').bold('build finish')}\n\n`,'utf-8');
    } else {
        const __log = `${chalk.hex('5bc2e7').bold('[luban]')} ${chalk.hex('70dfdf').bold(__percentage)} ${chalk.hex('6980c5').bold(message)}`
        process.stdout.write(__log,'utf-8');
    }
    
}

module.exports = WriteProgress;