const sendSuccess = (res, options = {}) => {
  const { statusCode, metadata } = options;
  res.status(statusCode || 200).json({ status: 'success', ...metadata });
};

module.exports = sendSuccess;
