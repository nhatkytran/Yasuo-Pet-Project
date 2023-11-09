const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
// const session = require('express-session');

const {
  abilitiesRouter,
  allgamesRouter,
  errorToAdminRouter,
  exploreGamesRouter,
  galleryRouter,
  ruinedRouter,
  skinsRouter,
  subwebRouter,
  userRouter,
} = require('./routes');

const { sessionOptions } = require('./config/database');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

const { NODE_ENV } = process.env;

if (NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test --> cors only for Yasuo The King
app.use(cors());
app.options('*', cors());

// Sessions
// app.use(session(sessionOptions));

app.get('/', (req, res) => {
  res.status(200).json({
    message:
      'Hello! This API is made to serve `Yasuo | The King of All Kings`. If you wanna use this API, please contact the author Nhat Ky Tran via email <nhockkutean2@gmail.com>',
  });
});

app.use('/api/v1/abilities', abilitiesRouter);
app.use('/api/v1/allgames', allgamesRouter);
app.use('/api/v1/errorToAdmin', errorToAdminRouter);
app.use('/api/v1/exploreGames', exploreGamesRouter);
app.use('/api/v1/gallery', galleryRouter);
app.use('/api/v1/ruined', ruinedRouter);
app.use('/api/v1/skins', skinsRouter);
app.use('/api/v1/subweb', subwebRouter);
app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

module.exports = app;
