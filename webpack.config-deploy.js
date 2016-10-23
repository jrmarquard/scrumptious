var production = true;
console.log('Running webpack for ' + (production ? 'production' : 'dev'));

var webpack = require('webpack');

module.exports = {
    context: __dirname,
    // If debuging, use inline-sourcemap whichw ill add a SourceMap as DataUrl to the js filew
    devtool: !production ? "inline-sourcemap" : null,
    // File we are compiling from
    entry: "./js/app.js",
    module: {
        loaders: [
            {
                // Anything that's a jsx file gets run through the babel-loader.
                test: /\.jsx?$/,
                // Except for node_modeuls and bower_components
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    // transpile react, es code, new features
                    presets: ['react', 'es2015', 'stage-0'],
                    // convert react html attributes (e.g. class -> className), add class properties es6, use decorators
                    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
                }
            }, {
                test: /\.s?css$/,
                loaders: ['style', 'css', 'sass'],
            }
        ]
    },
    // Output the compressed js file in /public/app.min.js
    output: {
        path: __dirname + "/public/",
        filename: "app.min.js"
    },
    // When debugging is true, use no plugins.
    // When debuggins is false, we want to produce a production ready .js
    // file using these plugins
    plugins: !production ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(
            {
                compress: {
                    warnings: false,
                    screw_ie8: true
                },
                mangle: true,
                comments: false,
                sourceMap: false
            }
        ),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ],
};
