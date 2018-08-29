var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, 'src/app');
var sassLoader = 'style-loader!css-loader!sass-loader?sourceMap=true&sourceMapContents=true';

var config = {
    entry: APP_DIR + '/index.jsx',
    devtool: 'source-map',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
        publicPath: '/assets',
    },
    module: {
        loaders: [
            {
                test: /\.js?$|\.jsx?$/,
                include: APP_DIR,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, 'src/')
                ],
                loader: sassLoader,
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
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