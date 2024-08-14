let path = require('path');

module.exports = {
    mode: 'development',
    entry: './frontend/main',
    output: {
        path: path.resolve(__dirname, 'public', 'assets', 'javascript'),
        filename: 'bundle.js'
    },

    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/env']
                }
            }
        }]
    },

    devtool: 'source-map'
};