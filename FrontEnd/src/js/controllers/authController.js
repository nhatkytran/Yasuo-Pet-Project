import {
  BACKEND_URL,
  CONTENT,
  ERROR,
  LOADING,
  TOAST_SUCCESS,
  TOAST_FAIL,
  TOAST_WARNING,
  ERROR_ABORT_CODE,
} from '../config';

import { catchAsync, isUsernameValid, isPasswordValid } from '../utils';

import store from '../models/store';
import authService from '../models/features/auth/authService';
import userService from '../models/features/user/userService';

import ModalContentController from './modalContentController';

const filename = 'authController.js';

class AuthController extends ModalContentController {
  #AuthView;
  #ToastView;
  #handleOpenModal;
  #handleCloseModal;
  #loginUsername = '';
  #loginPassword = '';
  #loginValid = false;

  constructor(AuthView, ToastView, handleOpenModal, handleCloseModal) {
    super();
    this.#AuthView = AuthView;
    this.#ToastView = ToastView;
    this.#handleOpenModal = handleOpenModal;
    this.#handleCloseModal = handleCloseModal;
  }

  handleLoginOpen = () =>
    super.open(this.#handleOpenModal, this.#AuthView.loginOpen);

  handleLoginClose = () => {
    authService.loginAbort();
    super.close(this.#handleCloseModal, this.#AuthView.loginClose);
  };

  handleLoginSuccess = () => this.#AuthView.loginSuccess();

  handleCheckIsLoggedIn = async () => {
    try {
      await userService.authService('/api/v1/users/checkIsLoggedIn');
      return true;
    } catch (error) {
      return false;
    }
  };

  handleLoginWarning = () =>
    this.#ToastView.createToast(store.state.toast[TOAST_WARNING]);

  handleLoginEnterUsername = username => {
    this.#AuthView.loginWarningMessage({ isError: false, field: 'username' });
    this.#loginUsername = username.trim();

    this.#loginValid =
      isUsernameValid(this.#loginUsername) &&
      isPasswordValid(this.#loginPassword);
    this.#AuthView.loginButtonDisplay({ canLogin: this.#loginValid });
  };

  handleLoginEnterPassword = password => {
    this.#AuthView.loginWarningMessage({ isError: false, field: 'password' });
    this.#loginPassword = password;

    this.#loginValid =
      isUsernameValid(this.#loginUsername) &&
      isPasswordValid(this.#loginPassword);
    this.#AuthView.loginButtonDisplay({ canLogin: this.#loginValid });
  };

  handleLoginBlurUsername = () =>
    !isUsernameValid(this.#loginUsername) &&
    this.#AuthView.loginWarningMessage({ isError: true, field: 'username' });

  handleLoginBlurPassword = () =>
    !isPasswordValid(this.#loginPassword) &&
    this.#AuthView.loginWarningMessage({ isError: true, field: 'password' });

  handleLoginPasswordType = () => this.#AuthView.loginPasswordTypeDisplay();

  handleLogin = catchAsync({
    filename,
    onProcess: async () => {
      if (!this.#loginValid) return;
      this.#AuthView.loginActionDisplay({ state: LOADING });

      await authService.login('/api/v1/users/login', {
        username: this.#loginUsername,
        password: this.#loginPassword,
      });

      this.#AuthView.loginActionDisplay({ state: CONTENT });
      this.#loginUsername = '';
      this.#loginPassword = '';
      this.#loginValid = false;
      this.handleLoginClose();
      this.handleLoginSuccess();
      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Welcome! Great to see you.',
      });
    },
    onError: error => {
      if (error.code === ERROR_ABORT_CODE)
        return this.#AuthView.loginActionDisplay({ state: CONTENT });

      let errorMessage = 'Something went wrong! Please try again.';

      if (error.response) {
        const { code, message } = error.response.data;
        [
          'LOGIN_AUTHENTICATION_ERROR',
          'LOGIN_BAN_ERROR',
          'LOGIN_ACTIVE_ERROR',
        ].includes(code) && (errorMessage = message);
      }

      this.#AuthView.loginActionDisplay({ state: ERROR, errorMessage });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  handleLoginSocial = social => {
    if (['facebook', 'github', 'apple'].includes(social)) return;

    let link;
    if (social === 'google') link = `${BACKEND_URL}/api/v1/users/auth/google`;

    window.location.href = link;
  };

  //

  handleLogout = catchAsync({
    filename,
    onProcess: async () => {
      this.#AuthView.logoutActionDisplay(LOADING);

      await authService.logout('/api/v1/users/logout');

      this.#AuthView.logoutActionDisplay(CONTENT);
      this.#AuthView.logoutSuccess();
      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'See you later.',
      });
    },
    onError: () => {
      this.#AuthView.logoutActionDisplay(ERROR);
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });
}

export default AuthController;
