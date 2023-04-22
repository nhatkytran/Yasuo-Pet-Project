const { AppError } = require('../utils');

const { NODE_ENV } = process.env;

const handleValidationErrorDB = () =>
  new AppError('Type String is required!', 400);

const globalErrorHandler = (error, req, res, next) => {
  let newError = NODE_ENV === 'development' ? error : Object.create(error);

  if (NODE_ENV === 'production') {
    if (newError.name === 'ValidationError')
      newError = handleValidationErrorDB(newError);
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
