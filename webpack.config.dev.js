const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const outputPath = path.resolve(__dirname, './dist');
const srcPath = path.resolve(__dirname, 'src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules/');
const bundleId = 'dev';
const baseUrl = '/';

module.exports = {
    entry: {
        index: './src/index',
        grammarComponent: './src/components/Grammar/index',
        sw: './src/sw',
    },
    output: {
        path: outputPath,
        publicPath: './',
        filename: `[name].[hash].js`,
        // hashFunction: customHashFunction,
        globalObject: 'this'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [nodeModulesPath, srcPath]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: srcPath,
                use: 'ts-loader?configFile=tsconfig.json'
            },
            {
                test: /\.scss$/,
                loaders: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
                include: [srcPath],
                exclude: []
            },
            {
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ]
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html.ejs'),
            filename: 'index.html',
            path: outputPath,
            excludeChunks: ['sw', 'grammarComponent'],
            env: {
                PROD: false,
            },
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            HASH_ID: JSON.stringify(bundleId),
            BASE_URL: JSON.stringify(baseUrl),
            DATE: JSON.stringify(new Date().toISOString()),
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new CopyPlugin([{
            from: 'static',
        }]),
        new WriteFilePlugin(),
        new Dotenv({
            path: './.env.local',
            safe: true,
            systemvars: true,
            silent: true,
            defaults: './.env'
        })
    ],
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
