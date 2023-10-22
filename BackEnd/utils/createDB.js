const createDB = (DB, alters) =>
  Object.entries(alters).reduce(
    (acc, [key, value]) => acc.replace(key, value),
    DB
  );

module.exports = createDB;
