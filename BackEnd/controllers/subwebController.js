const { Subweb } = require('../models');
const { catchAsync, AppError } = require('../utils');

exports.getSubWebVideo = catchAsync(async function (_, res) {
  const videos = await Subweb.find();
  const video = videos[0];

  if (!video) throw new AppError('Video not found!', 404);

  // test
  const start = Date.now();
  while (Date.now() - start < 1000) {}

  res.status(200).json({
    status: 'success',
    video,
  });
});

exports.createSubwebVideo = catchAsync(async function (req, res) {
  const { linkMp4, linkWebm } = req.body;

  if (!linkMp4 || !linkWebm)
    throw new AppError('Please provide < linkMp4 > and < linkWebm >.', 400);

  const video = await Subweb.create({ linkMp4, linkWebm });

  res.status(201).json({
    status: 'success',
    video: video,
  });
});
