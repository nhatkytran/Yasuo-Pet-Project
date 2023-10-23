const path = require('path');

const common = {
  entry: './src/js/controllers/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js',
  },
};

module.exports = common;
