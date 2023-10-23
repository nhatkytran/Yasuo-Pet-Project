const path = require('path');
const { merge } = require('webpack-merge');

const common = require('./webpack.common.config');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    port: 8080,
    static: {
      directory: path.resolve(__dirname, '..'),
    },
    devMiddleware: {
      index: 'index.html',
      writeToDisk: true, // By default, dist folder is created in memory
    },
    client: {
      overlay: true,
    },
    liveReload: false,
  },
});
