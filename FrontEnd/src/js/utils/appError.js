class AppError extends Error {
  constructor(options = {}) {
    super(options.message || 'Something went wrong!');

    this.errorType = options.errorType || '';
    this.authError = options.authError || false;
    this.authBefore = options.authBefore || false;
  }
}

export default AppError;
