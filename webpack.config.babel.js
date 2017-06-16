const path = require('path');
const webpack = require('webpack');

const PRODUCTION = process.env.NODE_ENV === 'production';

function getPlugins() {
  let plugins = [];
  if (PRODUCTION) {
    plugins.push(new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }));
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true
      },
      compress: {
        screw_ie8: true
      },
      comments: false
    }));
  }
  return plugins;
}

function getDevServer() {
  var devServer;
  if (!PRODUCTION) {
    devServer = {
      contentBase: path.join(__dirname, 'example'),
    };
  }
  return devServer;
}

export default () => ({
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './release'),
    filename: PRODUCTION ? 'analytics.min.js' : 'analytics.js',
    libraryTarget: 'umd',
    library: 'Auth0Analytics'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  devtool: 'source-map',
  //plugins: getPlugins(),
  devServer: getDevServer()
});