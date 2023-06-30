const mongoose = require('mongoose');

const abilitiesShema = new mongoose.Schema({
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

const abilitiesCollectionName = 'abilities';
const Abilities = mongoose.model(
  'Abilities',
  abilitiesShema,
  abilitiesCollectionName
);

module.exports = Abilities;
