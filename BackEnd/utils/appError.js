class AppError extends Error {
  constructor(message, statusCode, code = '', console = true) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.code = code;
    this.isOperational = true;
    this.console = console;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
