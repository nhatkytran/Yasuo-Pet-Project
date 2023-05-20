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
  images: {
    mains: [imageField],
    side: {
      larges: [imageField],
      smalls: [
        {
          type: {
            type: String,
            enum: ['image', 'svg', 'text'],
            required: [true, 'All Games image must have `type`!'],
          },
          [String]: { type: String }, // link (image | svg) | content (svg)
        },
      ],
    },
  },
  descriptions: [String],
  image_alts: [String],
  colors: {
    bg: [String],
  },
});

const allGamesCollectionName = 'allgames';
const AllGames = mongoose.model(
  'AllGames',
  allGamesSchema,
  allGamesCollectionName
);

module.exports = AllGames;
