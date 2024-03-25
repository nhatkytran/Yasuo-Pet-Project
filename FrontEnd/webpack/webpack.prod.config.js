const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// const glob = require('glob');
// const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

const common = require('./webpack.common.config');
// const { mainCwd } = require('./utils');

module.exports = merge(common, {
  mode: 'production',
  // devtool: 'source-map', // Don't expose you code unless needing to debug in production code
  optimization: {
    usedExports: true, // Tree shaken applied by default by Webpack in produciton mode
    minimize: true,
    minimizer: [
      `...`, // Keep settings of Webpack
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxSize: Infinity,
      minSize: 2000,
      cacheGroups: {
        validator: {
          test: /[\\/]node_modules[\\/]validator[\\/]/,
          name: 'validator',
        },
        node_modules: {
          test: /[\\/]node_modules[\\/]/,
          name: 'node_modules',
          chunks: 'initial',
        },
        async: {
          test: /[\\/]node_modules[\\/]/,
          chunks: 'async',
          name(module, chunks) {
            return chunks.map(chunk => chunk.name).join('-');
          },
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
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
    // new PurgeCSSPlugin({
    //   paths: glob.sync(mainCwd('/src/**/*'), { nodir: true }),
    // }),
  ],
});
