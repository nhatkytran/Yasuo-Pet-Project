const { ErrorToAdmin } = require('../models');
const { catchAsync } = require('../utils');

exports.createError = catchAsync(async (req, res) => {
  await ErrorToAdmin.create(req.body);
  res.status(201).json({ status: 'success' });
});
