const { Gallery } = require('../models');
const { getSectionData } = require('./handlerFactory');

exports.getData = getSectionData({
  Model: Gallery,
  cacheRedis: true,
  dataName: 'galleryAssets',
});
