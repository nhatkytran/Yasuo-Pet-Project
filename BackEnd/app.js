const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');

const session = require('express-session');
const passport = require('passport');
const { sessionOptions } = require('./config/database');
require('./config/passport');

const {
  abilitiesRouter,
  allGamesRouter,
  errorToAdminRouter,
  exploreGamesRouter,
  galleryRouter,
  ruinedRouter,
  skinsRouter,
  subwebRouter,
  userRouter,
} = require('./routes');

const app = express();

const { NODE_ENV } = process.env;
if (NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: 'http://127.0.0.1:8080',
    credentials: true,
  })
);
app.options('*', cors());

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  if (NODE_ENV === 'development') {
    console.log(req.session);
    console.log('isAuthenticated:', req.isAuthenticated());
  }

  res.status(200).json({
    message:
      'Hello! This API is made to serve `Yasuo | The King of All Kings`. If you wanna use this API, please contact the author Nhat Ky Tran via email <nhockkutean2@gmail.com>',
  });
});

app.use('/api/v1/abilities', abilitiesRouter);
app.use('/api/v1/allGames', allGamesRouter);
app.use('/api/v1/errorToAdmin', errorToAdminRouter);
app.use('/api/v1/exploreGames', exploreGamesRouter);
app.use('/api/v1/gallery', galleryRouter);
app.use('/api/v1/ruined', ruinedRouter);
app.use('/api/v1/skins', skinsRouter);
app.use('/api/v1/subweb', subwebRouter);
app.use('/api/v1/users', userRouter);

app.use(globalErrorHandler);

module.exports = app;
