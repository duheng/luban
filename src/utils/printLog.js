const chalk = require('chalk');
const readline = require('readline');
const printLog = (message) => {
    const __log = `${chalk.hex('5bc2e7').bold('[luban]')} ${chalk.hex('6980c5').bold(message)}`
    process.stdout.write(__log,'utf-8');
}
module.exports = {
    printLog
}