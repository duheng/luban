const { chalk } = require('@qnpm/ykit3-shared-utils')

const defaultMessage = chalk`没有实现的抽象方法`

class NoImplementionError extends Error {
    constructor (message = defaultMessage) {
        super(message)

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = NoImplementionError
