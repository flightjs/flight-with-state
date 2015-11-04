var constants = require('./constants');
var baseConfig = require('./webpack.config');

module.exports = Object.assign(baseConfig, {
    output: {
        library: 'flight-with-state',
        filename: 'flight-with-state.js',
        libraryTarget: 'umd',
        path: constants.BUILD_DIRECTORY
    }
});
