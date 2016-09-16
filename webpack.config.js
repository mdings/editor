module.exports = {
    entry: './main.js',

    output: {
        filename: './build/index.js'
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