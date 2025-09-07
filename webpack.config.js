const path = require('path');

module.exports = {
  entry: {
    'gridstack-all': './src/gridstack.ts',
  },
  mode: 'production', // production vs development
  devtool: 'source-map',
  // devtool: 'eval-source-map', // for best (large .js) debugging. see https://survivejs.com/webpack/building/source-maps/
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.build.json'
          }
        },
        exclude: ['/node_modules/', '/spec/'],
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'GridStack',
    libraryExport: 'GridStack',
    libraryTarget: 'umd', // var|assign|this|window|self|global|commonjs|commonjs2|commonjs-module|amd|amd-require|umd|umd2|jsonp|system
  }
};
