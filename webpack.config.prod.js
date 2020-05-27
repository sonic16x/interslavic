const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const baseUrl = process.env.BASE_URL || '/';
const isDemo = process.env.DEMO !== undefined;
const outputPath = path.resolve(__dirname, `./dist${baseUrl}`);
const srcPath = path.resolve(__dirname, './src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const bundleId = 'prod';

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
            excludeChunks: ['sw', 'grammarComponent'],
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
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            SW: !isDemo,
            HASH_ID: JSON.stringify(bundleId),
            BASE_URL: JSON.stringify(baseUrl),
            VERSION: JSON.stringify(require('./package.json').version),
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new CopyPlugin([{
            from: 'static',
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
    ]
};
