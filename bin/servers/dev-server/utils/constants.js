const configResolver = require('@qnpm/ykit3-config-resolver')
const CONFIG_FILE_NAME = configResolver.configFileName

module.exports = {
    MODE_NAMES: {
        MULTIPLE: 'multiple',
        SINGLE: 'single',
        OTHER: 'other'
    },
    CONFIG_FILE_NAME,
    REGEX_PATTERN: {
        URL_PROJECT_NAME: /^\/([^\/]*)/
    },
    WEBPACK_HMR_URL: '__webpack_hmr',
    HOT_HEART_BEAT_INTERVAL: 1000 * 1
}
