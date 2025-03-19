const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: [
        './js/app.js'
    ],
    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },

    devtool: '#cheap-module-eval-source-map',

    resolve: {
        extensions: ['', '.js', '.css', '.scss']
    },

    plugins: [
        new MiniCssExtractPlugin({filename: 'bundle.css',}),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {   test: /\.css$/, 
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [autoprefixer()]
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolveLoader: {
        modules: [ 'node_modules ']
    }
};