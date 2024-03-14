const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const { createDB } = require('../utils');

const {
  NODE_ENV,
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

// DATABASE=mongodb+srv://<DATABASE_NAME>:<DATABASE_PASSWORD>@yasuo.ivod4dz.mongodb.net/<DATABASE_COLLECTION_NAME>?retryWrites=true&w=majority

const SESSION_DB = createDB(DATABASE, {
  ...commonAlters,
  '<DATABASE_COLLECTION_NAME>': DATABASE_COLLECTION_SESSION,
});

// Session -> SessionID stored in Cookie
// Cookie -> Cookie header and Set-cookie header

let cookieOptions = {};

// In development invironment, backend is 127.0.0.1:3000 and frontend is 127.0.0.1:8080
// but when deploy, we have 2 different origins, so we need to config this
if (NODE_ENV !== 'development')
  cookieOptions = {
    secure: true,
    sameSite: 'none',
  };

exports.sessionOptions = {
  secret: DATABASE_COLLECTION_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: SESSION_DB }),
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    ...cookieOptions,
  },
};

const DATABASE_DB = createDB(DATABASE, {
  ...commonAlters,
  '<DATABASE_COLLECTION_NAME>': DATABASE_COLLECTION_YASUO,
});

mongoose
  .set('strictQuery', true)
  .connect(DATABASE_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connection - Successful'));
