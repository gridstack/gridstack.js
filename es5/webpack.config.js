const path = require('path');
const webpackConfig = require('../webpack.config.js');

const config = {...webpackConfig, 
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: 'es5/tsconfig.json'
          }
        },
        exclude: ['/node_modules/'],
      },
    ],
  },
};
config.output.path = path.resolve(__dirname, '../dist/es5')
module.exports = config