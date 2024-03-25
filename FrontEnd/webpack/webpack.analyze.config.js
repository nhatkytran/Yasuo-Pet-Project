const { merge } = require('webpack-merge');
const production = require('./webpack.prod.config.js');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(production, {
  plugins: [
    new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }),
  ],
});
