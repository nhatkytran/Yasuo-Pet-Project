import {
  ERROR_TIMEOUT_CODE,
  ERROR_ABORT_CODE,
  ERROR_TIMEOUT_MESSAGE,
  ERROR_ABORT_MESSAGE,
} from '../config';

export const checkTimeoutError = error =>
  error.code === ERROR_TIMEOUT_CODE &&
  error.message.includes(ERROR_TIMEOUT_MESSAGE);

export const checkAbortError = error =>
  error.code === ERROR_ABORT_CODE &&
  error.message.includes(ERROR_ABORT_MESSAGE);
