const path = require('path');

export default () => ({
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'analytics.js',
    libraryTarget: 'umd',
    library: 'Auth0Analytics'
  },
  // externals: {
  //     'lodash': {
  //         commonjs: 'lodash',
  //         commonjs2: 'lodash',
  //         amd: 'lodash',
  //         root: '_'
  //     }
  // },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  devServer: {
    contentBase: path.join(__dirname, 'example'),
  }
});