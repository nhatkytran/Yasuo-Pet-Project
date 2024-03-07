const { AllGames } = require('../models');
const { getSectionData } = require('./handlerFactory');

exports.getData = getSectionData({
  Model: AllGames,
  cacheRedis: true,
  dataName: 'allGamesAssets',
});
