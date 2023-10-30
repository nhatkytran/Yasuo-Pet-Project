import { ENV } from '../config';

window.onerror = function (message, source, lineno, colno, error) {
  if (ENV === 'development') {
    console.error('\n--- UNCAUGHT EXCEPTION! Shutting down... ---\n');
    console.error(error);
  }

  // Prevent the default browser error handling
  return true;
};
