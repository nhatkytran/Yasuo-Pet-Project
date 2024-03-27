const mongoose = require('mongoose');
const { createDB } = require('../utils');

const {
  DATABASE,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_COLLECTION_YASUO,
} = process.env;

// DATABASE=mongodb+srv://<DATABASE_NAME>:<DATABASE_PASSWORD>@yasuo.ivod4dz.mongodb.net/<DATABASE_COLLECTION_NAME>?retryWrites=true&w=majority
const DATABASE_DB = createDB(DATABASE, {
  '<DATABASE_NAME>': DATABASE_NAME,
  '<DATABASE_PASSWORD>': DATABASE_PASSWORD,
  '<DATABASE_COLLECTION_NAME>': DATABASE_COLLECTION_YASUO,
});

mongoose
  .set('strictQuery', true)
  .connect(DATABASE_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connection - Successful'));
