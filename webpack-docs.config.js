const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

module.exports = {
    devtool: 'inline-source-map',
    entry: './main-docs.ts',
    stats: "minimal",
    output: {
        filename: 'bundle.js',
        library: ["agGrid"],
        libraryTarget: "umd",
        publicPath: "http://192.168.0.100:9999/"
    },
    resolve: {
        alias: {
            "./dist/lib/main": "./src/main.ts",
            "./dist/lib": "./src/ts"
        },
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [ 
            { test: /\.tsx?$/, use: [
                { loader: 'cache-loader' },
                {
                    loader: 'thread-loader',
                    options: {
                        workers: require('os').cpus().length - 1,
                    },
                },
                {
                    loader: 'ts-loader',
                    options: {
                        happyPackMode: true,
                        configFileName: './ag-grid/tsconfig-exports.json'
                    }
                }
            ]},
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { sourceMap: true } },
                    { loader: 'sass-loader', options: { sourceMap: true } },
                    { loader: 'postcss-loader', options: { sourceMap: true, syntax: 'postcss-scss', plugins: [ autoprefixer() ] } },
                ]
            }, 
            {
                test: /\.(svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192
                        }
                    }
                ]
            }
        ],
    },

    devServer: {
        hot: true,
        port: 9999,
        host: '0.0.0.0',
        stats: "minimal",
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        }
    },
    plugins: [
        // new ExtractTextPlugin('styles.css'),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({ tsconfig: './ag-grid/tsconfig-exports.json' })
    ]
}
