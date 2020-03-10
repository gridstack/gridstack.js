const path = require('path');

module.exports = {
  entry: './src/index.ts',
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
    filename: 'gridstack.all.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'GridStack',
    libraryExport: 'GridStack',
    libraryTarget: 'umd',
  }
};
