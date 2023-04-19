const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();

const { NODE_ENV } = process.env;

if (NODE_ENV === 'development') app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Love Coding',
  });
});

module.exports = app;
