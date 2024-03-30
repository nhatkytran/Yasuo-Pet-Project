const AutoPrefixer = require('autoprefixer');

module.exports = {
  plugins: [
    AutoPrefixer({
      overrideBrowserslist: ['> 0.25%'],
    }),
  ],
};
