import { TOAST_FAIL } from '../config';
import store from '../models/store';
import kickout from './kickout';

const authErrorShouldKickout = (error, ToastView) => {
  let errorContent = {};

  if (error.response) {
    const { code } = error.response.data;
    const isAuthBefore = store.state.user.ok;

    if (code === 'AUTHENTICATION_ERROR') {
      if (isAuthBefore)
        return kickout({
          createToast: ToastView.createToast,
          success: false,
          message:
            'Please sign in to get access! Page will refresh in 5 seconds.',
        });

      errorContent = { content: 'Please login to get access!' };
    }
  }

  ToastView.createToast({ ...store.state.toast[TOAST_FAIL], ...errorContent });
};

export default authErrorShouldKickout;
