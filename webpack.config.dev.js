const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');
const srcPath = path.resolve(__dirname, 'src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules/');
const baseUrl = '/';

module.exports = {
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
        publicPath: '/',
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
                include: srcPath,
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
        new CopyWebpackPlugin({
            patterns: [
                { from: 'static', to: outputPath },
            ],
        }),
    ],
    optimization: {
        emitOnErrors: false,
        runtimeChunk: 'single',
    },
    devtool: 'eval-source-map',
    stats: 'errors-only',
    devServer: {
        host: '0.0.0.0',
        port: 3000,
        historyApiFallback: true,
    }
};
