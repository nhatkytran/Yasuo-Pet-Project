const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  skins: [
    {
      name: { type: String },
      releaseYear: { type: Number },
      inCollection: { type: String },
      price: { type: Number },
      tags: [String],
      details: [String],
      image: { type: String },
      youtubeLink: { type: String },
    },
  ],
});

const cltName = 'skins';
const Skins = mongoose.model('Skins', schema, cltName);

module.exports = Skins;
