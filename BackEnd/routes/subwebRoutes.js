const express = require('express');

const {
  getSubWebVideo,
  createSubwebVideo,
} = require('../controllers/subwebController');

const subwebRouter = express.Router();

subwebRouter.route('/video').get(getSubWebVideo).post(createSubwebVideo);

module.exports = subwebRouter;
