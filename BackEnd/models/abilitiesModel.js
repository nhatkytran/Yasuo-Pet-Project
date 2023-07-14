const mongoose = require('mongoose');

const shema = new mongoose.Schema({
  videos: [
    {
      mp4: { type: String },
      webm: { type: String },
    },
  ],
  descriptions: [
    {
      small: { type: String },
      medium: { type: String },
      big: { type: String },
    },
  ],
});

const cltName = 'abilities';
const Abilities = mongoose.model('Abilities', shema, cltName);

module.exports = Abilities;
