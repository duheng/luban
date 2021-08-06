const chalk = require('chalk');

const defaultMessage = chalk`没有实现的抽象方法`

class NoImplementionError extends Error {
    constructor (message = defaultMessage) {
        super(message)

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = NoImplementionError
