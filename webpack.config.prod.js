const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const outputPath = path.resolve(__dirname, './dist');
const srcPath = path.resolve(__dirname, './src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const bundleId = 'prod';
const baseUrl = process.env.BASE_URL || '/';

function customHashFunction() {
    return {
        digest: () => bundleId,
        update: () => {
        },
    }
}

module.exports = {
    mode: 'production',
    entry: {
        index: './src/index',
        grammarComponent: './src/components/Grammar/index',
        sw: './src/sw',
    },
    output: {
        path: outputPath,
        publicPath: './',
        filename: `[name].[hash].js`,
        hashFunction: customHashFunction
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: [nodeModulesPath, srcPath]
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                include: srcPath,
                use: 'ts-loader?configFile=tsconfig.json'
            },
            {
                test: /\.s?css$/,
                include: [
                    srcPath,
                ],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true,
                            }
                        },
                        {
                            loader: 'postcss-loader',
                        },
                        {
                            loader: 'sass-loader',
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpe?g)$/,
                exclude: /node_modules/,
                use: [
                    'preload-image-loader',
                    'file-loader?[path][name].[ext]'
                ]
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader'
            },
            {
                test: /\.(woff|woff2)$/,
                use: 'url-loader?prefix=font/&limit=50000'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: 'url-loader?limit=10000&mimetype=application/octet-stream'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'svg-sprite-loader',
                options: {
                    runtimeCompat: true
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(srcPath, 'index.html'),
            filename: 'index.html',
            path: outputPath,
            excludeChunks: ['sw', 'grammarComponent'],
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            HASH_ID: JSON.stringify(bundleId),
            BASE_URL: JSON.stringify(baseUrl),
            DATE: JSON.stringify(new Date().toISOString()),
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new CopyPlugin([{
            from: 'static',
            transform: (content, path) => {
                if (path.indexOf('.json') !== -1 || path.indexOf('.html') !== -1) {
                    return content
                        .toString()
                        .replace(/#{HASH_ID}/g, bundleId)
                        .replace(/#{BASE_URL}/g, baseUrl)
                        ;
                }
                return content;
            },
        }]),
        new ExtractTextPlugin('styles/[name].[hash].css'),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /styles/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {discardComments: {removeAll: true}}],
            },
            canPrint: true
        }),
        new Dotenv({
            path: './.env.prod',
            safe: true,
            systemvars: true,
            silent: true,
            defaults: './.env'
        })
    ]
};
