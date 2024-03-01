import {
  CONTENT,
  LOADING,
  ERROR,
  TOAST_SUCCESS,
  TOAST_FAIL,
  CLEAR_TOAST_TIMEOUT,
} from '../config';

import { AppError, catchAsync, isEmailValid, kickout } from '../utils';

import store from '../models/store';
import authService from '../models/features/auth/authService';

const filename = 'soloController.js';

class SoloController {
  #SoloView;
  #ToastView;

  #message = '';
  #email = '';
  #submitValid = false;
  #submitLoading = false;

  constructor(SoloView, ToastView) {
    this.#SoloView = SoloView;
    this.#ToastView = ToastView;
  }

  #isMessageValid = message => message.length <= 300;

  #checkSubmitValid = () =>
    this.#isMessageValid(this.#message) && isEmailValid(this.#email);

  handleEnterMessage = message => {
    this.#SoloView.warningMessage({ isError: false, field: 'message' });
    this.#message = message.trim();
    this.#submitValid = this.#checkSubmitValid();
    this.#SoloView.buttonDisplay({ canSubmit: this.#submitValid });
  };

  handleBlurMessage = () =>
    !this.#isMessageValid(this.#message) &&
    this.#SoloView.warningMessage({ isError: true, field: 'message' });

  handleEnterEmail = email => {
    this.#SoloView.warningMessage({ isError: false, field: 'email' });
    this.#email = email.trim();
    this.#submitValid = this.#checkSubmitValid();
    this.#SoloView.buttonDisplay({ canSubmit: this.#submitValid });
  };

  handleBlurEmail = () =>
    !isEmailValid(this.#email) &&
    this.#SoloView.warningMessage({ isError: true, field: 'email' });

  #resetSubmitKit = () => {
    this.#message = '';
    this.#email = '';
    this.#submitValid = false;
    this.#submitLoading = false;
  };

  handleSubmit = catchAsync({
    filename,
    onProcess: async () => {
      if (!this.#submitValid || this.#submitLoading) return;

      this.#submitLoading = true;
      this.#SoloView.actionDisplay({ state: LOADING });

      if (!(await authService.checkIsLoggedIn()))
        throw new AppError({
          authError: true,
          authBefore: store.state.user.ok,
        });

      await authService.sendSolo({
        message: this.#message,
        opponentEmail: this.#email,
      });

      this.#resetSubmitKit();
      this.#SoloView.actionDisplay({ state: CONTENT });
      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Email has been sent successfully!',
      });
    },
    onError: error => {
      this.#submitLoading = false;
      this.#SoloView.actionDisplay({ state: ERROR });

      if (error.authError && error.authBefore)
        return kickout({
          createToast: this.#ToastView.createToast,
          success: false,
          message:
            'Please sign in to get access! Page will refresh in 5 seconds.',
        });

      const content = error.authError
        ? { content: 'Please login to get access!' }
        : {};

      this.#ToastView.createToast({
        ...store.state.toast[TOAST_FAIL],
        ...content,
      });
    },
  });
}

export default SoloController;
