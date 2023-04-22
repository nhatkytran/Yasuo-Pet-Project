const path = require('path');
const express = require('express');
const morgan = require('morgan');

const subWebRouter = require('./routes/subwebRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

const { NODE_ENV } = process.env;

if (NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/subweb', subWebRouter);

app.use(globalErrorHandler);

module.exports = app;
