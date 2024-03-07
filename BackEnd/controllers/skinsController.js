const { Skins } = require('../models');
const { getSectionData } = require('./handlerFactory');

exports.getData = getSectionData({
  Model: Skins,
  cacheRedis: true,
  dataName: 'skinsAssets',
});
