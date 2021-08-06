const { MODE_NAMES } = require('../utils/constants')
const MultipleMode = require('./MultipleMode')
const SingleMode = require('./SingleMode')
const InvalidModeError = require('../errors/InvalidModeError')

module.exports = (stateName, args) => {
    switch (stateName) {
    case MODE_NAMES.SINGLE:
        return new SingleMode(args)
    case MODE_NAMES.MULTIPLE:
        return new MultipleMode(args)
    default:
        throw new InvalidModeError().message
    }
}
