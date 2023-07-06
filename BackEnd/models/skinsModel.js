const mongoose = require('mongoose');

const skinsSchema = new mongoose.Schema({
  images: [
    {
      link: { type: String },
    },
  ],
});

const skinsCollectionName = 'skins';
const Skins = mongoose.model('Skins', skinsSchema, skinsCollectionName);

module.exports = Skins;
