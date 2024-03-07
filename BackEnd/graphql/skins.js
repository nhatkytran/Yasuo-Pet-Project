const { Skins } = require('../models');

exports.getSkins = async () => {
  try {
    const [data] = await Skins.find().cacheRedis();
    return data;
  } catch (error) {
    return null;
  }
};
