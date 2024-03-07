const { Ruined } = require('../models');
const { getSectionData } = require('./handlerFactory');

exports.getData = getSectionData({
  Model: Ruined,
  cacheRedis: true,
  dataName: 'ruinedAssets',
});
