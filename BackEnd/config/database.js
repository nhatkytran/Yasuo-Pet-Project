const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { createDB } = require('../utils');

const {
  DATABASE,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_COLLECTION_YASUO,
  DATABASE_COLLECTION_SESSION,
  DATABASE_COLLECTION_SESSION_SECRET,
} = process.env;

const commonAlters = {
  '<DATABASE_NAME>': DATABASE_NAME,
  '<DATABASE_PASSWORD>': DATABASE_PASSWORD,
};

const MS = createDB(DATABASE, {
  ...commonAlters,
  '<DATABASE_COLLECTION_NAME>': DATABASE_COLLECTION_SESSION,
});

exports.sessionOptions = {
  secret: DATABASE_COLLECTION_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: MS }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
};

const DB = createDB(DATABASE, {
  ...commonAlters,
  '<DATABASE_COLLECTION_NAME>': DATABASE_COLLECTION_YASUO,
});

console.log(DATABASE_COLLECTION_SESSION);
console.log(DB);

mongoose
  .set('strictQuery', true)
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connection - Successful'));
