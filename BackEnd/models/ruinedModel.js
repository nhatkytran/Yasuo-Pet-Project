const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  images: {
    main: { type: String },
    sub: { type: String },
  },
});

const cltName = 'ruineds';
const Ruined = mongoose.model('Ruined', schema, cltName);

module.exports = Ruined;
