const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');

const outputPath = path.resolve(__dirname, './dist');
const srcPath = path.resolve(__dirname, './src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
    devtool: 'source-map',
    entry: [
      './src/index'
    ],
    output: {
      path: outputPath, // Note: Physical files are only output by the production build task `npm run build`.
      publicPath: './',
      filename: 'index.js'
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
          test: /\.css$/,
          loaders: [
            'style-loader',
            'css-loader',
          ],
          exclude: []
        },
        {
          test: /\.s?css$/,
          include: srcPath,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
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
      new HtmlWebpackPlugin({
        template: path.join(srcPath, 'index.html'),
        filename: 'index.html',
        path: outputPath
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new CopyPlugin([
        { from: './manifest.json', to: 'manifest.json' },
        { from: './icon.png', to: 'icon.png' },
        { from: './logo.png', to: 'logo.png' },
      ]),
      new ExtractTextPlugin('style.css'),
      new webpack.LoaderOptionsPlugin({
        debug: true
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
