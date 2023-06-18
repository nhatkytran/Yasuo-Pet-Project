const { ExploreGames } = require('../models');
const { catchAsync, AppError } = require('../utils');

exports.getData = catchAsync(async (_, res) => {
  const [data] = await ExploreGames.find();

  if (!data) throw new AppError("Explore Games's data not found!", 404);

  // Test
  const start = Date.now();
  while (Date.now() - start < 2000) {}

  res.status(200).json({
    status: 'success',
    exploreGamesAssets: data,
  });
});
