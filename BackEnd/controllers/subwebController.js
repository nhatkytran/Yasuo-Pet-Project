const Subweb = require('../models/subwebModel');
const { catchAsync } = require('../utils');

exports.getsubWebVideo = async function (req, res, next) {
  try {
    res.status(200).json({
      status: 'success',
      video: '',
    });
  } catch (error) {
    console.error('Something went wrong!');
    console.error(error);
  }
};

exports.createSubwebVideo = catchAsync(async function (req, res, next) {
  const { linkMp4, linkWebm } = req.body;

  if (!linkMp4 || !linkWebm) throw new Error('Bad!');

  const video = await Subweb.create({ linkMp4, linkWebm });

  res.status(200).json({
    status: 'success',
    video: video,
  });
});
