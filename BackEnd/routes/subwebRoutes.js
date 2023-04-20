const express = require('express');

const {
  getsubWebVideo,
  createSubwebVideo,
} = require('../controllers/subwebController');

const subWebRouter = express.Router();

subWebRouter.route('/video').get(getsubWebVideo).post(createSubwebVideo);

module.exports = subWebRouter;
