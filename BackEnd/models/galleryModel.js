const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  gallery: [
    {
      image: { type: String },
      link: { type: String },
      title: { type: String },
    },
  ],
});

const cltName = 'galleries';
const Gallery = mongoose.model('Gallery', schema, cltName);

module.exports = Gallery;
