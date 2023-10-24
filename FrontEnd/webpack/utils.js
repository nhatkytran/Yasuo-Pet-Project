const path = require('path');

exports.mainCwd = (...rest) => path.resolve(__dirname, '..', ...rest);
