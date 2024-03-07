const { catchAsync, AppError } = require('../utils');

exports.getSectionData = options => {
  const { Model, cacheRedis, dataName } = options;

  return catchAsync(async (req, res) => {
    const query = Model.find();
    if (cacheRedis) query.cacheRedis();

    const [data] = await query;
    if (!data) throw new AppError('Data not found!', 404);

    res.status(200).json({ status: 'success', [dataName]: data });
  });
};
