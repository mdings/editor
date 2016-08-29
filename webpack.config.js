// @TODO: include a dev server

module.exports = {
    entry: './main.js',

    output: {
        filename: 'build/bundle.js'
    },
    
    module: {
        loaders: [
            {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['es2015']
            }
            }
        ]
    }
}