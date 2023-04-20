const mongoose = require('mongoose');

const { DATABASE, DATABASE_NAME, DATABASE_PASSWORD } = process.env;

const DB = DATABASE.replace('<DATABASE_NAME>', DATABASE_NAME).replace(
  '<DATABASE_PASSWORD>',
  DATABASE_PASSWORD
);

mongoose
  .set('strictQuery', true)
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connection - Successful'));
