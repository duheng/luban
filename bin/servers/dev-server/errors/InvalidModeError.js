const chalk = require('chalk');

const defaultMessage = chalk`
    {cyan.bold ykit3} 只支持两种启动模式： {yellow 单工程模式（single mode）}和 {yellow 多工程模式 （multiple mode）}
 
        {underline 单工程模式（single）}: 启动单个工程 （当前目录下有ykit3.config.js）

        {underline 多工程模式（multiple）}: 启动多个工程（当前当前目录的子目录有ykit3.config.js）
`

class InvalidModeError extends Error {
    constructor (message = defaultMessage) {
        super(message)

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = InvalidModeError
