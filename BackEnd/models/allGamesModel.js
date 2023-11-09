const mongoose = require('mongoose');

const imageField = {
  type: {
    type: String,
    enum: ['image'],
    required: [true, 'All Games image must have `type`!'],
  },
  link: { type: String },
};

const schema = new mongoose.Schema({
  images: {
    main: [imageField],
    side: {
      larges: [imageField],
      smalls: {
        type: [
          {
            type: {
              type: String,
              enum: ['image', 'svg', 'text'],
              required: [true, 'All Games image must have `type`!'],
            },
            // link (image | svg) | content (svg)
            link: { type: String },
            content: { type: String },
          },
        ],
        validate: [
          smalls => smalls.every(item => item.link || item.content),
          'Item can only have either `link` or `content`',
        ],
      },
    },
  },
  descriptions: [String],
  image_alts: [String],
  colors: {
    bg: [String],
  },
  platforms: [[String]],
});

const cltName = 'allgames';
const Allgames = mongoose.model('Allgames', schema, cltName);

module.exports = Allgames;
