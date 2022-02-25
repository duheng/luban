const path = require("path");
const chalk = require('chalk');

const getUtilName = () => {
    const __package = path.join(__dirname,"..","..","package.json");
    console.log('__package-----', __package)
    return Object.keys(__package.bin)[0]
}
const printLog = ({name = '', type='default', text = ''}) => {
    const __color = {
        default: {
            title: '5bc2e7',
            text: '70dfdf'
        },
        error: {
            title: '800080',
            text: '9932CC'
        }
    }
    const __nameStyle = chalk.hex(__color[type].title).bold
    const __textStyle = chalk.hex(__color[type].text).bold
    const __name = name || getUtilName()
    console.log(__nameStyle(`[${__name}]`),__textStyle(text))
}

module.exports = {
    printLog,
    getUtilName,
}
