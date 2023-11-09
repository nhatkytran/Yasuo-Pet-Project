const express = require('express');

const { getData } = require('../controllers/allGamesController');

const allGamesRouter = express.Router();

allGamesRouter.route('/data').get(getData);

module.exports = allGamesRouter;
