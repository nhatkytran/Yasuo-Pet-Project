const glob = require('glob');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

const common = require('./webpack.common.config');
const { mainCwd } = require('./utils');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      `...`, // Keep settings of Webpack
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into separate files
          'css-loader', // Translates CSS into CommonJS
          'postcss-loader',
          'sass-loader', // Compiles Sass to CSS
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:12].css', // Specify the output CSS filename
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(mainCwd('/src/**/*'), { nodir: true }),
    }),
  ],
});
