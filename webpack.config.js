let path = require('path')
let webpack = require('webpack')
let ExtractTextPlugin = require("extract-text-webpack-plugin")
let HtmlWebpackPlugin = require('html-webpack-plugin')
let release = process.argv.indexOf('--release') !== -1


module.exports = {
    entry: {
        app: './client/app-frontend/main.js',
        backend: "./client/app-backend/main.js"
    },
    output: {
        path: path.resolve(__dirname, './public'),
        publicPath: '/',
        filename: 'assets/[name].bundle.js'
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules')
    },
    resolve: {
        root: [ path.resolve('./client') ],
        extensions: ['', '.js', '.vue']
    },
    plugins: [
        new HtmlWebpackPlugin({ 
            template: './client/app-frontend/index.html', 
            hash: true, 
            chunks: ['app'],
            filename: 'index.html' 
        }),
        new HtmlWebpackPlugin({ 
            template: './client/app-backend/index.html', 
            hash: true, 
            chunks: ['backend'],
            filename: 'backend.html' 
        }),
        new ExtractTextPlugin("assets/style.bundle.css", { allChunks: true })
    ],
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?minimize"),
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production' || release) {
    module.exports.devtool = ''
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin()
    ])
}