/**
 * WEBPACK CONFIG
 *
 * Notes on config properties:
 *
 * 'entry'
 * Entry point for the bundle.
 *
 * 'output'
 * If you pass an array - the modules are loaded on startup. The last one is exported.
 *
 * 'resolve'
 * Array of file extensions used to resolve modules.
 *
 * devtool: 'eval-source-map'
 * http://www.cnblogs.com/Answer1215/p/4312265.html
 * The source map file will only be downloaded if you have source maps enabled
 * and your dev tools open.
 *
 * OccurrenceOrderPlugin
 * Assign the module and chunk ids by occurrence count. Ids that are used often
 * get lower (shorter) ids. This make ids predictable, reduces to total file size
 * and is recommended.
 *
 * UglifyJsPlugin
 * Minimize all JavaScript output of chunks. Loaders are switched into minimizing mode.
 *    - 'compress'
 *      Compressor is a tree transformer which reduces the code size by applying
 *      various optimizations on the AST.
 *
 * 'NODE_ENV'
 * React relies on process.env.NODE_ENV based optimizations.
 * If we force it to production, React will get in an optimized manner.
 * This will disable some checks (eg. property type checks) and give you a smaller
 *    build and improved performance.
 *
 *    Note: That JSON.stringify is needed as webpack will perform string replace
 *    "as is". In this case we'll want to end up with strings as that's what
 *    various comparisons expect, not just production. Latter would just cause
 *    an error.
 *
 * 'babel'
 * Babel enables the use of ES6 today by transpiling your ES6 JavaScript into
 * equivalent ES5 source that is actually delivered to the end user browser.
 */

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './scripts/index',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    // Fix webpack's default behavior to not load packages with jsnext:main module
    // https://github.com/Microsoft/TypeScript/issues/11677
    mainFields: ['browser', 'main']
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new HtmlWebpackPlugin({
      version: new Date().getTime(),
      template: 'index.ejs',
      filename: '../index.html',
      inject: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              plugins: ['react-hot-loader/babel'],
            },
          },
          'awesome-typescript-loader', // (or awesome-typescript-loader)
        ],
        exclude: /node_modules/
      }
    ]
  }
};
