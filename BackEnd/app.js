const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const { subwebRouter, allGamesRouter } = require('./routes');

const globalErrorHandler = require('./controllers/errorController');

const app = express();

const { NODE_ENV } = process.env;

if (NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options('*', cors());

app.use('/api/v1/subweb', subwebRouter);
app.use('/api/v1/allGames', allGamesRouter);

app.use(globalErrorHandler);

module.exports = app;
