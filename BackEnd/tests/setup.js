// Backend -> npm run devj -> supports Authentication testing

jest.setTimeout(30 * 1000);

const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../config.env') });

const { createDB } = require('../utils');

require('../models/userModel');

const {
  DATABASE,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_COLLECTION_YASUO,
} = process.env;

const DATABASE_DB = createDB(DATABASE, {
  '<DATABASE_NAME>': DATABASE_NAME,
  '<DATABASE_PASSWORD>': DATABASE_PASSWORD,
  '<DATABASE_COLLECTION_NAME>': DATABASE_COLLECTION_YASUO,
});

mongoose
  .set('strictQuery', true)
  .connect(DATABASE_DB, { useNewUrlParser: true, useUnifiedTopology: true });
