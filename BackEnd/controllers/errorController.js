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

const globalErrorHandler = (error, _, res, __) => {
  let newError = NODE_ENV === 'development' ? error : Object.create(error);

  if (NODE_ENV === 'production') {
    // ValidationError
    if (newError.name === 'ValidationError')
      newError = handleValidationErrorDB(newError);

    // CastError --> Invalid id
    if (newError.name === 'CastError') newError = handleCastErrorDB(newError);

    // Duplicate Erro
    if (newError.code === 11000) newError = handleDuplicateError(newError);
  }

  newError.statusCode = newError.statusCode || 500;
  newError.status = newError.status || 'error';
  newError.message = newError.message || 'Something went wrong!';

  if (NODE_ENV === 'development') sendErrorDevAPI(newError, res);
  if (NODE_ENV === 'production') sendErrorProdAPI(newError, res);
};

const sendErrorDevAPI = (error, res) => {
  const { statusCode, status, message, stack } = error;
  res.status(statusCode).json({ status, message, stack, error });
};

const sendErrorProdAPI = (error, res) => {
  let { statusCode, status, message } = error;

  if (!error.isOperational) {
    statusCode = 500;
    status = 'error';
    message = 'Something went wrong!';
  }

  res.status(statusCode).json({ status, message });
};

module.exports = globalErrorHandler;
