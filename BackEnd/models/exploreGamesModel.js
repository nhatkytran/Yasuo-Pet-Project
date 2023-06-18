const mongoose = require('mongoose');

const exploreGamesSchema = new mongoose.Schema({
  images: [
    {
      link: { type: String },
    },
  ],
});

const exploreGamesCollectionName = 'exploregames';
const ExploreGames = mongoose.model(
  'ExploreGames',
  exploreGamesSchema,
  exploreGamesCollectionName
);

module.exports = ExploreGames;
