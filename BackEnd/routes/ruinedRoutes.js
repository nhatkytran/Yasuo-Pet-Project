const express = require('express');

const { getData } = require('../controllers/ruinedController');

const ruinedRouter = express.Router();

ruinedRouter.route('/data').get(getData);

module.exports = ruinedRouter;
