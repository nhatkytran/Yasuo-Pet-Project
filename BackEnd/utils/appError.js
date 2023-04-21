class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    const c = function () {
      console.log('asqwd asdjkqbda qadionqcna asdac');
    };

    c();

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
