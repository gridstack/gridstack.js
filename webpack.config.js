const path = require('path');

module.exports = {
  entry: {
    'gridstack.all': './src/index.ts'
  },
  externals: {
    // jquery: 'jQuery'
  },
  mode: 'development',
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
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: 'GridStack',
    libraryExport: 'GridStack',
    libraryTarget: 'umd',
  }
};
