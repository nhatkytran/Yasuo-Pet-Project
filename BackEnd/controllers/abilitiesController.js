const { Abilities } = require('../models');
const { catchAsync, AppError } = require('../utils');

exports.getData = catchAsync(async (_, res) => {
  const [data] = await Abilities.find().cacheRedis();

  if (!data) throw new AppError("Abilities's data not found!", 404);

  res.status(200).json({
    status: 'success',
    abilitiesAssets: data,
  });
});
