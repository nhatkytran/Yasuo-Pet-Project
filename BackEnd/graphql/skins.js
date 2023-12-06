const { Skins } = require('../models');

exports.getSkins = async () => {
  try {
    const [data] = await Skins.find();
    return data;
  } catch (error) {
    return null;
  }
};
