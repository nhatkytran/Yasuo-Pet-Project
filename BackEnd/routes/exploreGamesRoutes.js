const express = require('express');

const { getData } = require('../controllers/exploreGamesController');

const exploreGamesRouter = express.Router();

exploreGamesRouter.route('/data').get(getData);

module.exports = exploreGamesRouter;
