const { Abilities } = require('../models');
const { getSectionData } = require('./handlerFactory');

exports.getData = getSectionData({
  Model: Abilities,
  cacheRedis: true,
  dataName: 'abilitiesAssets',
});
