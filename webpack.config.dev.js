const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outputPath = path.resolve(__dirname, './dist');
const srcPath = path.resolve(__dirname, 'src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules/');
const baseUrl = '/';

module.exports = {
    entry: {
        index: './src/index',
        grammarComponent: './src/components/Grammar/index',
        viewerComponent: './src/components/Viewer/index',
        sw: './src/sw',
    },
    output: {
        path: outputPath,
        publicPath: '/',
        filename: `[name].[contenthash].js`,
        globalObject: 'this',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: [nodeModulesPath, srcPath]
    },
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
              test: /\.(png|jpg|jpeg|gif)$/i,
              issuer: /\.s?css$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[hash].[ext]',
                    outputPath: 'static',
                    esModule: false,
                  }
                },
              ],
            },
            {
                test: /\.tsx?$/,
                include: srcPath,
                exclude: /node_modules/,
                use: 'ts-loader?configFile=tsconfig.json'
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
                include: [srcPath],
                exclude: [],
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html.ejs'),
            filename: 'index.html',
            path: outputPath,
            excludeChunks: ['sw', 'grammarComponent', 'viewerComponent'],
            env: {
                ANALYTICS: false,
                BASE_URL: baseUrl,
            },
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            SW: false,
            CLIENT: true,
            BASE_URL: JSON.stringify(baseUrl),
            DATE: JSON.stringify(new Date().toISOString()),
            VERSION: JSON.stringify(require('./package.json').version),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'static', to: outputPath },
            ],
        }),
    ],
    optimization: {
        noEmitOnErrors: true,
    },
    devtool: 'inline-source-map',
    devServer: {
        stats: 'errors-only',
        contentBase: outputPath,
        host: '0.0.0.0',
        port: 3000,
        inline: true,
        hot: true,
        historyApiFallback: true
    }
};
