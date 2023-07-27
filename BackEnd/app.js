const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const {
  subwebRouter,
  allGamesRouter,
  exploreGamesRouter,
  abilitiesRouter,
  skinsRouter,
  ruinedRouter,
} = require('./routes');

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

app.use('/api/v1/subweb', subwebRouter);
app.use('/api/v1/allGames', allGamesRouter);
app.use('/api/v1/exploreGames', exploreGamesRouter);
app.use('/api/v1/abilities', abilitiesRouter);
app.use('/api/v1/skins', skinsRouter);
app.use('/api/v1/ruined', ruinedRouter);

app.use(globalErrorHandler);

module.exports = app;
