const { merge } = require('webpack-merge');

const { mainCwd } = require('./utils');
const common = require('./webpack.common.config');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map', // faster than 'source-map' and good for development
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  devServer: {
    port: 8080,
    static: {
      directory: mainCwd(),
    },
    devMiddleware: {
      index: 'index.html',
      writeToDisk: true, // By default, dist folder is created in memory
    },
    client: {
      overlay: true,
    },
    liveReload: true,
    hot: false,
  },
});
