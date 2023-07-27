const { Ruined } = require('../models');
const { catchAsync, AppError } = require('../utils');

exports.getData = catchAsync(async (_, res) => {
  const [data] = await Ruined.find();

  if (!data) throw new AppError("Ruined's data not found!", 404);

  // Test
  const start = Date.now();
  while (Date.now() - start < 2000) {}

  res.status(200).json({
    status: 'success',
    ruinedAssets: data,
  });
});
