var webpack = require('webpack')
var path = require('path')
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
var env = process.env.WEBPACK_ENV

var libName = 'Editor'
var plugins = []
var outputFile

if (env === 'build-min') {

    plugins.push(new UglifyJsPlugin({ minimize: true }))
    outputFile = 'lib/' + libName.toLowerCase() + '.min.js'

} else if (env === 'build') {

    outputFile = 'lib/' + libName.toLowerCase() + '.js'

} else {

    outputFile = 'lib/' + libName.toLowerCase() + '.dev.js';
}

module.exports = {

    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output: {

        filename: outputFile,
        library: libName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    module: {

        loaders: [
            {

                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
            }
        ]
    },
    plugins: plugins
}