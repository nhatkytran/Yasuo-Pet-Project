const express = require('express');

const { getData } = require('../controllers/galleryController');

const galleryRouter = express.Router();

galleryRouter.route('/data').get(getData);

module.exports = galleryRouter;
