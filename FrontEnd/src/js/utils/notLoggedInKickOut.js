import { CLEAR_TOAST_TIMEOUT, TOAST_FAIL } from '../config';
import store from '../models/store';

const notLoggedInKickOut = createToast => {
  setTimeout(() => window.location.reload(), CLEAR_TOAST_TIMEOUT);

  createToast(
    {
      ...store.state.toast[TOAST_FAIL],
      content: 'Please login to get access! Page will refresh in 5 seconds.',
    },
    true
  );
};

export default notLoggedInKickOut;
