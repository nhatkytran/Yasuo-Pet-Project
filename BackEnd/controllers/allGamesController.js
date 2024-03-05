const { AllGames } = require('../models');
const { catchAsync, AppError } = require('../utils');

exports.getData = catchAsync(async (_, res) => {
  const [data] = await AllGames.find();

  if (!data) throw new AppError("All Games's data not found!", 404);

  res.status(200).json({
    status: 'success',
    allGamesAssets: data,
  });
});
