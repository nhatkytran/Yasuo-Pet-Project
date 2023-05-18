const express = require('express');

const { getAllImages } = require('../controllers/allGamesController');

const allGamesRouter = express.Router();

allGamesRouter.route('/images').get(getAllImages);

module.exports = allGamesRouter;
