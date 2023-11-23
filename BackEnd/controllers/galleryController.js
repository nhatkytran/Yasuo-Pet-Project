const { Gallery } = require('../models');
const { catchAsync, AppError } = require('../utils');

exports.getData = catchAsync(async (_, res) => {
  const [data] = await Gallery.find();
  if (!data) throw new AppError("Gallery's data not found!", 404);

  res.status(200).json({
    status: 'success',
    galleryAssets: data,
  });
});
