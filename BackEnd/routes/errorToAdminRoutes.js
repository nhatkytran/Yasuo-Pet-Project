const express = require('express');

const { createError } = require('../controllers/errorToAdminController');

const errorToAdminRouter = express.Router();

errorToAdminRouter.post('/', createError);

module.exports = errorToAdminRouter;
