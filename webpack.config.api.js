const path = require('path')
const srcPath = path.resolve(__dirname, './src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

module.exports = {
    target: 'webworker',
    entry: {
        bundle: path.join(__dirname, './src/server/index.ts'),
    },
    output: {
        filename: 'worker.js',
        path: path.join(__dirname, 'dist'),
    },
    mode: 'production',
    watchOptions: {
        ignored: /node_modules|dist|\.js/g,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
        modules: [nodeModulesPath, srcPath],
        plugins: [],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader?configFile=tsconfig.json',
                include: srcPath,
            },
        ],
    },
}
