const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputPath = path.resolve(__dirname, `./dist`);
const srcPath = path.resolve(__dirname, './src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index',
        sw: './src/serviceWorker/sw',
    },
    output: {
        path: outputPath,
        publicPath: './',
        filename: `[name].js`,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [nodeModulesPath, srcPath]
    },
    optimization: {
        minimize: true,
        emitOnErrors: true,
        splitChunks: false,
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                issuer: /\.s?css$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[contenthash].[ext]',
                            publicPath: 'static',
                            outputPath: 'static',
                            esModule: false,
                        }
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                include: srcPath,
                use: 'ts-loader?configFile=tsconfig.json'
            },
            {
                test: /\.scss$/,
                include: srcPath,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ]
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerMode: 'static',
            reportFilename: path.resolve(__dirname, 'report.html'),
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html.ejs'),
            filename: 'index.html',
            path: outputPath,
            excludeChunks: ['sw'],
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            VERSION: JSON.stringify(require('./package.json').version),
            PR_NUMBER: JSON.stringify(process.env.PR_NUMBER),
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'static', to: outputPath },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
    ]
};
