import { CLEAR_TOAST_TIMEOUT, TOAST_SUCCESS, TOAST_FAIL } from '../config';
import store from '../models/store';

const kickout = options => {
  const { createToast, success, message } = options;
  const toastType = success ? TOAST_SUCCESS : TOAST_FAIL;

  let content = {};
  if (message) content = { content: message };
  else if (success) content = { content: 'Perform action successfully!' };

  setTimeout(() => window.location.reload(), CLEAR_TOAST_TIMEOUT);
  createToast({ ...store.state.toast[toastType], ...content }, true);
};

export default kickout;
