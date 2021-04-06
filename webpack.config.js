const path = require('path');

module.exports = {
  entry: {
    'gridstack-h5': './src/gridstack-h5.ts',
    'gridstack-jq': './src/gridstack-jq.ts',
    'gridstack-static': './src/gridstack-static.ts'
  },
  mode: 'production', // production vs development
  devtool: 'source-map',
  // devtool: 'eval-source-map', // for best (large .js) debugging. see https://survivejs.com/webpack/building/source-maps/
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: ['/node_modules/', '/src/h5/', '/src/index-*.ts'], // TODO: doesn't seem to excluded for generating .d.ts !
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
    alias: {
      'jquery': '/src/jq/jquery.js',
      'jquery-ui': '/src/jq/jquery-ui.js',
      'jquery.ui': '/src/jq/jquery-ui.js',
      'jquery.ui.touch-punch' : '/src/jq/jquery.ui.touch-punch',
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
