const express = require('express');

const { getData } = require('../controllers/abilitiesController');

const abilitiesRouter = express.Router();

abilitiesRouter.route('/data').get(getData);

module.exports = abilitiesRouter;
