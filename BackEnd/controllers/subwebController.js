const { Subweb } = require('../models');
const { catchAsync, AppError } = require('../utils');

exports.getSubWebVideo = catchAsync(async function (_, res) {
  const videos = await Subweb.find();
  const video = videos[0];

  if (!video) throw new AppError('Video not found!', 404);

  res.status(200).json({
    status: 'success',
    video,
  });
});
