const express = require('express');

const { getSubWebVideo } = require('../controllers/subwebController');

const subwebRouter = express.Router();

subwebRouter.route('/video').get(getSubWebVideo);

module.exports = subwebRouter;
