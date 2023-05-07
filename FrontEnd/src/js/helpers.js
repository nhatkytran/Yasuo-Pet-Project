export const catchAsync =
  fn =>
  async (...rest) => {
    try {
      return await fn(...rest);
    } catch (error) {
      throw error;
    }
  };
