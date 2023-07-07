const mongoose = require('mongoose');

const skinsSchema = new mongoose.Schema({
  skins: [
    {
      name: { type: String },
      image: { type: String },
      type: { type: String },
      price: { type: Number },
      tags: [String],
      details: [String],
    },
  ],
});

const skinsCollectionName = 'skins';
const Skins = mongoose.model('Skins', skinsSchema, skinsCollectionName);

module.exports = Skins;
