const mongoose = require('mongoose');

const imageField = {
  type: {
    type: String,
    enum: ['image'],
    required: [true, 'All Games image must have `type`!'],
  },
  link: { type: String },
};

const allGamesSchema = new mongoose.Schema({
  mains: [imageField],
  sideLarges: [imageField],
  sideSmalls: [
    {
      type: {
        type: String,
        enum: ['image', 'svg', 'text'],
      },
      [String]: { type: String },
    },
  ],
});

const allGamesCollectionName = 'allgames';
const AllGames = mongoose.model(
  'AllGames',
  allGamesSchema,
  allGamesCollectionName
);

module.exports = AllGames;
