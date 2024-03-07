const { ExploreGames } = require('../models');
const { getSectionData } = require('./handlerFactory');

exports.getData = getSectionData({
  Model: ExploreGames,
  cacheRedis: true,
  dataName: 'exploreGamesAssets',
});
