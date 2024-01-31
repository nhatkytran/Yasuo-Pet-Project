import { CONTENT, LOADING, ERROR, TOAST_SUCCESS, TOAST_FAIL } from '../config';
import { catchAsync, isEmailValid, isUsernameValid } from '../utils';

import store from '../models/store';
import authService from '../models/features/auth/authService';

const filename = 'soloController.js';

class SoloController {
  #SoloView;
  #ToastView;

  #name = '';
  #email = '';
  #submitValid = false;
  #submitLoading = false;

  constructor(SoloView, ToastView) {
    this.#SoloView = SoloView;
    this.#ToastView = ToastView;
  }

  #checkSubmitValid = () =>
    isUsernameValid(this.#name) && isEmailValid(this.#email);

  handleEnterName = name => {
    this.#SoloView.warningMessage({ isError: false, field: 'name' });
    this.#name = name.trim();
    this.#submitValid = this.#checkSubmitValid();
    this.#SoloView.buttonDisplay({ canSubmit: this.#submitValid });
  };

  handleBlurName = () =>
    !isUsernameValid(this.#name) &&
    this.#SoloView.warningMessage({ isError: true, field: 'name' });

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
    this.#name = '';
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

      await authService.sendSolo({
        inGameName: this.#name,
        challengeeEmail: this.#email,
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

      if (error.response) {
        const { code, message } = error.response.data;

        ['SEND_SOLO_NAME_ERROR'].includes(code) &&
          this.#SoloView.warningMessage({
            isError: true,
            field: 'name',
            customMessage: message,
          });
      }

      this.#SoloView.actionDisplay({ state: ERROR });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });
}

export default SoloController;
