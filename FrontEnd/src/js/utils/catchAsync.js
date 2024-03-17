import { ENV, ERROR_ABORT_CODE } from '../config';
import axiosInstance from '../models/axios';

const catchAsync = ({
  filename,
  onProcess,
  onError = () => {},
  onFinnally = () => {},
}) => {
  if (!filename) throw new Error('Please provideo `filename` parameter!');

  return async (...args) => {
    try {
      await onProcess(...args);
    } catch (error) {
      if (ENV === 'development') handleErrorDev(error);
      if (ENV === 'production') {
        // error.errorType is passed in controller.js
        // error.errorType = < error >
        error.errorType !== ERROR_ABORT_CODE &&
          handleErrorProd(error, filename);
      }

      onError(error);
    } finally {
      onFinnally(...args);
    }
  };
};

const handleErrorDev = error => {
  console.error('Something went wrong!');
  console.error(error);
};

const handleErrorProd = async (error, filename) => {
  try {
    await axiosInstance.post('/api/v1/errorToAdmin', {
      when: new Date(),
      where: filename,
      error: {
        message: error.message,
        stackJSONFormat: JSON.stringify(error.stack),
      },
    });
  } catch (error) {
    console.error('Something went wrong sending error message to admin!');
    console.log(
      'If you see this message. Please contact us via < yasuotheking2@gmail.com > to help make Yasuo | The King of All Kings better. Thank you for you help!'
    );
  }
};

export default catchAsync;
