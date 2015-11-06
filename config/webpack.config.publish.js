var constants = require('./constants');
var baseConfig = require('./webpack.config');

module.exports = Object.assign(baseConfig, {
    output: {
        library: 'withState',
        filename: 'flight-with-state.js',
        libraryTarget: 'umd',
        path: constants.BUILD_DIRECTORY
    },
    externals: [
        'lodash.merge'
    ]
});
