const globalErrorHandler = (error, req, res, next) => {
  console.error('Something went wrong!');

  res.status(500).json({
    status: 'fail',
    error,
  });
};

module.exports = globalErrorHandler;
