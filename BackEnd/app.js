const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const { AppError } = require('./utils');

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

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

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

  res.status(200).render('pageAPI');
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

app.all('*', (req, _, next) =>
  next(new AppError(`${req.originalUrl} not found!`, 404))
);

app.use(globalErrorHandler);

module.exports = app;
