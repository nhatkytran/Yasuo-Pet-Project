const express = require('express');

const { getData } = require('../controllers/skinsController');

const skinsRouter = express.Router();

skinsRouter.route('/data').get(getData);

module.exports = skinsRouter;
