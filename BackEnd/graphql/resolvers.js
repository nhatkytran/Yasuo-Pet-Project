const { getSkins } = require('./skins');

const resolvers = {
  Query: {
    skins: async () => {
      const data = await getSkins();
      if (!data) throw new Error('Skins not found!');
      return data.skins;
    },
  },
};

module.exports = resolvers;
