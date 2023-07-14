const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  images: [{ link: { type: String } }],
});

const cltName = 'exploregames';
const ExploreGames = mongoose.model('ExploreGames', schema, cltName);

module.exports = ExploreGames;
