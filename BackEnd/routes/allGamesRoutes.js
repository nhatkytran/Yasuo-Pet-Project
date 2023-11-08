const express = require('express');

const { getData } = require('../controllers/allgamesController');

const allgamesRouter = express.Router();

allgamesRouter.route('/data').get(getData);

module.exports = allgamesRouter;
