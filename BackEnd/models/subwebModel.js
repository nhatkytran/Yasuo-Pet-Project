const mongoose = require('mongoose');

const shema = new mongoose.Schema({
  linkMp4: { type: String },
  linkWebm: { type: String },
});

const cltName = 'subwebs';
const Subweb = mongoose.model('Subweb', shema, cltName);

module.exports = Subweb;
