const { AppError } = require('../utils');

const { NODE_ENV } = process.env;

const handleValidationErrorDB = error => new AppError(error.message, 400);

const handleCastErrorDB = error =>
  new AppError(`Invalid ${error.path}: ${error.value}`, 400);

const handleDuplicateError = error => {
  const [key, value] = Object.entries(error.keyValue)[0];

  return new AppError(
    `Duplicate field < ${key} >: < ${value} >. Please use another value!`,
    400
  );
};

const globalErrorHandler = (error, req, res, __) => {
  let newError = NODE_ENV === 'development' ? error : Object.create(error);

  if (NODE_ENV === 'production') {
    // ValidationError
    if (newError.name === 'ValidationError')
      newError = handleValidationErrorDB(newError);

    // CastError --> InvalidID
    if (newError.name === 'CastError') newError = handleCastErrorDB(newError);

    // DuplicateError
    if (newError.code === 11000) newError = handleDuplicateError(newError);
  }

  newError.statusCode = newError.statusCode || 500;
  newError.status = newError.status || 'error';
  newError.message = newError.message || 'Something went wrong!';

  if (newError.console) console.error(newError);

  if (NODE_ENV === 'production' && !newError.isOperational)
    console.error(newError);

  // Google login fail
  const isOAuth = newError.oAuth;

  if (!req.originalUrl.startsWith('/api') || isOAuth)
    return sendErrorRender(newError, res);

  if (NODE_ENV === 'development') sendErrorDevAPI(newError, res);
  if (NODE_ENV === 'production') sendErrorProdAPI(newError, res);
};

const sendErrorDevAPI = (error, res) => {
  const { statusCode, status, message, code, stack } = error;
  res.status(statusCode).json({ status, message, code, stack, error });
};

const sendErrorProdAPI = (error, res) => {
  let { statusCode, status, message, code } = error;

  if (!error.isOperational) {
    statusCode = 500;
    status = 'error';
    message = 'Something went wrong!';
    code = 'INTERNAL_SERVER_ERROR';
  }

  res.status(statusCode).json({ status, message, code });
};

const sendErrorRender = (error, res) => {
  const { statusCode } = error;
  res.status(statusCode).render('error');
};

module.exports = globalErrorHandler;
