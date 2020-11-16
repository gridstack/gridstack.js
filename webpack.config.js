const path = require('path');

module.exports = {
  entry: {
    'gridstack.all': './src/index-jq.ts',
    'gridstack.h5': './src/index-h5.ts',
    'gridstack.static': './src/index-static.ts'
  },
  mode: 'production', // production vs development
  devtool: 'source-map',
  // devtool: 'eval-source-map', // for best (large .js) debugging. see https://survivejs.com/webpack/building/source-maps/
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
    alias: {
      'jquery': '/src/jq/jquery.js',
      'jquery-ui': '/src/jq/jquery-ui.js',
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'GridStack',
    libraryExport: 'GridStack',
    libraryTarget: 'umd', // var|assign|this|window|self|global|commonjs|commonjs2|commonjs-module|amd|amd-require|umd|umd2|jsonp|system
  }
};
