const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const baseUrl = process.env.BASE_URL || '/';
const isDemo = process.env.DEMO !== undefined;
const outputPath = path.resolve(__dirname, `./dist${baseUrl}`);
const srcPath = path.resolve(__dirname, './src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index',
        grammarComponent: './src/components/Pages/Grammar/Grammar',
        viewerComponent: './src/components/Pages/Viewer/Viewer',
        communityComponent: './src/components/Pages/CommunityPage/CommunityPage',
        translatorComponent: './src/components/Pages/TranslatorPage/TranslatorPage',
        sw: './src/sw',
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
                            publicPath: `${baseUrl}static`,
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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html.ejs'),
            filename: 'index.html',
            path: outputPath,
            excludeChunks: ['sw', 'grammarComponent', 'viewerComponent'],
            env: {
                ANALYTICS: !isDemo,
                BASE_URL: baseUrl,
            },
        }),
        new HtmlWebpackPlugin({
            template: path.join(srcPath, '404.html.ejs'),
            filename: '404.html',
            path: outputPath,
            inject: false,
            env: {
                BASE_URL: baseUrl,
            },
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            SW: !isDemo,
            CLIENT: true,
            BASE_URL: JSON.stringify(baseUrl),
            VERSION: JSON.stringify(require('./package.json').version),
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
