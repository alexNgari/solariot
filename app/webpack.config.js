const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const VueLoaderPlugin = require('vue-loader/lib/plugin');
const path = require('path');

module.exports = {
    mode: 'development', // development/production
    entry: './app/main.js',
    output: {
        path: path.resolve(__dirname, 'app/assets/dist'), // target output dir
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                ],
                loader: 'babel-loader?cacheDirectory=true',
                options: {
                    plugins: ['transform-vue-jsx'],
                },
            },
        ],
    },
    optimization: {
        minimizer: [new UglifyJsPlugin({ cache: true })],
        splitChunks: {
            chunks: 'all',
        },
    },
};
