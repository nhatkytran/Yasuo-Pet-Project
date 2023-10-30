import { ENV } from '../config';

const handleErrorDev = error => {
  console.error('Something went wrong!');
  console.error(error);
};

const handleErrorProd = error => {
  console.log(
    'We have noticed this error. If error caused by the server. We are gonna fix it soon.'
  );
  console.log(
    'Now you can try again the action or just refresh the page few times!'
  );
  console.log(
    'For more information. Please contact us via email: nhockkutean2@gmail.com'
  );
  // Display toast
  // Send error to the server
};

const catchAsync =
  ({ onProcess, onError, onFinnally = () => {} }) =>
  async (...args) => {
    try {
      await onProcess(...args);
    } catch (error) {
      if (ENV === 'development') handleErrorDev(error);
      if (ENV === 'production') handleErrorProd(error);
      onError(error);
    } finally {
      onFinnally(...args);
    }
  };

export default catchAsync;
