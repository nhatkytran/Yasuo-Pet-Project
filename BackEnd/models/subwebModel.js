const mongoose = require('mongoose');

const subwebShema = new mongoose.Schema({
  linkMp4: { type: String },
  linkWebm: { type: String },
});

const subwebCollentionName = 'subwebs';
const Subweb = mongoose.model('Subweb', subwebShema, subwebCollentionName);

module.exports = Subweb;
