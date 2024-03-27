const AppError = require('./appError');

const authenticationError = errorMessage =>
  new AppError(errorMessage, 401, 'AUTHENTICATION_ERROR');

module.exports = authenticationError;
