var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src/app');

var config = {
    devtool: '#source-map',
    entry: [
        'babel-polyfill',
        APP_DIR + '/index.jsx',
    ],
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: '/assets',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                exclude: '/node_modules/',
                include: APP_DIR,
                loader: 'babel-loader',
                query:
                {
                    presets: ['es2015']
                }
            }
        ]
    },
    resolve: {
        extensions: ['.jsx','.js']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'src/app'),
        port: 59018,
        hot: true,
        disableHostCheck: true,
        inline: true,
    },
};

module.exports = config;