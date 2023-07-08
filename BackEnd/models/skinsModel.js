const mongoose = require('mongoose');

const skinsSchema = new mongoose.Schema({
  skins: [
    {
      name: { type: String },
      releaseYear: { type: Number },
      collection: { type: String },
      price: { type: Number },
      tags: [String],
      details: [String],
      image: { type: String },
      youtubeLink: { type: String },
    },
  ],
});

const skinsCollectionName = 'skins';
const Skins = mongoose.model('Skins', skinsSchema, skinsCollectionName);

module.exports = Skins;
