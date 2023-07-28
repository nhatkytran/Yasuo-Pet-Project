const mongoose = require('mongoose');

const imageType = {
  link: { type: String },
  alt: { type: String },
};

const schema = new mongoose.Schema({
  images: {
    main: imageType,
    sub: {
      ...imageType,
      linkHelper: { type: String },
    },
  },
});

const cltName = 'ruineds';
const Ruined = mongoose.model('Ruined', schema, cltName);

module.exports = Ruined;
