/* eslint-env node */
const path = require('path')

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname),
        publicPath: '/build/',
    },
    entry: {
        gliffyWars: './js/global.js',
        app: './js/index.js',
        local: './js/localOperation.js',
    },
    output: {
        filename: '[name].js',
        path: __dirname + 'build',
    },
    resolve: {
        alias: {
            /* eslint-disable key-spacing */
            assets:  path.resolve(__dirname, 'assets'),
            glsl:    path.resolve(__dirname, 'glsl'),
            js:      path.resolve(__dirname, 'js'),
            classes: path.resolve(__dirname, 'js', 'classes'),
            utility: path.resolve(__dirname, 'js', 'utility'),
            /* eslint-enable key-spacing */
        },
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: 'raw-loader',
            },
            {
                test: /\.glsl$/,
                exclude: /node_modules/,
                use: 'raw-loader',
            },
        ],
    },
}
