import {
  BACKEND_URL,
  ANIMATION_TIMEOUT,
  CONTENT,
  ERROR,
  LOADING,
  TOAST_SUCCESS,
  TOAST_FAIL,
  TOAST_WARNING,
  ERROR_ABORT_CODE,
} from '../config';

import {
  catchAsync,
  isActivateCodeValid,
  isEmailValid,
  isPasswordValid,
  isUsernameValid,
} from '../utils';

import store from '../models/store';
import authService from '../models/features/auth/authService';

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
  #loginLoading = false;

  #activateEmail = '';
  #activateEmailValid = false;
  #activateEmailLoading = false;
  #activateCode = '';
  #activateCodeValid = false;
  #activateCodeLoading = false;

  #forgotNameEmail = '';
  #forgotNameEmailValid = false;
  #forgotNameEmailLoading = false;

  #signupInfoUsername = '';
  #signupInfoEmail = '';
  #signupInfoPassword = '';
  #signupInfoValid = false;
  #signupInfoLoading = false;
  #signupCode = '';
  #signupCodeValid = false;
  #signupCodeLoading = false;

  constructor(AuthView, ToastView, handleOpenModal, handleCloseModal) {
    super();
    this.#AuthView = AuthView;
    this.#ToastView = ToastView;
    this.#handleOpenModal = handleOpenModal;
    this.#handleCloseModal = handleCloseModal;
  }

  // Sign-in //////////

  handleLoginCheckFirst = catchAsync({
    filename,
    onProcess: async () => {
      if (!(await this.handleCheckIsLoggedIn())) return;
      this.#AuthView.loginSuccess();
      this.#AuthView.loginSuccessSignal();
    },
  });

  handleLoginOpen = () =>
    super.open(this.#handleOpenModal, this.#AuthView.loginOpen);

  handleLoginClose = () => {
    authService.loginAbort();
    super.close(this.#handleCloseModal, this.#AuthView.loginClose);
  };

  handleCheckIsLoggedIn = async () => {
    try {
      await authService.checkIsLoggedIn('/api/v1/users/checkIsLoggedIn');
      return true;
    } catch (error) {
      return false;
    }
  };

  handleLoginWarning = () =>
    this.#ToastView.createToast(store.state.toast[TOAST_WARNING]);

  #checkLoginValid = () =>
    isUsernameValid(this.#loginUsername) &&
    isPasswordValid(this.#loginPassword);

  handleLoginEnterUsername = username => {
    this.#AuthView.loginWarningMessage({ isError: false, field: 'username' });
    this.#loginUsername = username.trim();
    this.#loginValid = this.#checkLoginValid();
    this.#AuthView.loginButtonDisplay({ canLogin: this.#loginValid });
  };

  handleLoginBlurUsername = () =>
    !isUsernameValid(this.#loginUsername) &&
    this.#AuthView.loginWarningMessage({ isError: true, field: 'username' });

  handleLoginEnterPassword = password => {
    this.#AuthView.loginWarningMessage({ isError: false, field: 'password' });
    this.#loginPassword = password;
    this.#loginValid = this.#checkLoginValid();
    this.#AuthView.loginButtonDisplay({ canLogin: this.#loginValid });
  };

  handleLoginBlurPassword = () =>
    !isPasswordValid(this.#loginPassword) &&
    this.#AuthView.loginWarningMessage({ isError: true, field: 'password' });

  handleLoginPasswordType = () => this.#AuthView.loginPasswordTypeDisplay();

  #resetLoginKit = () => {
    this.#loginUsername = '';
    this.#loginPassword = '';
    this.#loginValid = false;
    this.#loginLoading = false;
  };

  handleLogin = catchAsync({
    filename,
    onProcess: async () => {
      if (!this.#loginValid || this.#loginLoading) return;

      this.#AuthView.loginActionDisplay({ state: LOADING });
      this.#loginLoading = true;

      await authService.login('/api/v1/users/login', {
        username: this.#loginUsername,
        password: this.#loginPassword,
      });

      this.#AuthView.loginActionDisplay({ state: CONTENT });

      this.handleLoginClose();
      this.#AuthView.loginSuccess();
      this.#AuthView.loginSuccessSignal();
      this.#resetLoginKit();

      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Welcome! Great to see you.',
      });
    },
    onError: error => {
      this.#loginLoading = false;

      if (error.code === ERROR_ABORT_CODE) {
        this.#resetLoginKit();
        return this.#AuthView.loginActionDisplay({ state: CONTENT });
      }

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

  handleLoginChooseActivate = () =>
    setTimeout(
      () => super.open(this.#handleOpenModal, this.#AuthView.activateOpen),
      ANIMATION_TIMEOUT * 2
    );

  handleLoginChooseForgotName = () =>
    setTimeout(
      () => super.open(this.#handleOpenModal, this.#AuthView.forgotNameOpen),
      ANIMATION_TIMEOUT * 2
    );

  handleLoginChooseSignup = () =>
    setTimeout(
      () => super.open(this.#handleOpenModal, this.#AuthView.signupOpen),
      ANIMATION_TIMEOUT * 2
    );

  // Sign-out //////////

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

  // Activate //////////

  handleActivateClose = () => {
    authService.activateGetCodeAbort();
    authService.activateConfirmCodeAbort();
    super.close(this.#handleCloseModal, this.#AuthView.activateClose);
  };

  handleActivateWarning = () =>
    this.#ToastView.createToast({
      ...store.state.toast[TOAST_WARNING],
      content:
        "Only activate accounts created manually! (Don't support OAuth.)",
    });

  handleActivateEnterEmail = email => {
    this.#AuthView.activateWarningMessage({ isError: false, field: 'email' });
    this.#activateEmail = email.trim();
    this.#activateEmailValid = isEmailValid(this.#activateEmail);
    this.#AuthView.activateButtonDisplay({
      canLogin: this.#activateEmailValid,
    });
  };

  handleActivateBlurEmail = () =>
    !isEmailValid(this.#activateEmail) &&
    this.#AuthView.activateWarningMessage({ isError: true, field: 'email' });

  handleActivateEnterCode = code => {
    this.#AuthView.activateWarningMessage({ isError: false, field: 'code' });
    this.#activateCode = code.trim();
    this.#activateCodeValid = isActivateCodeValid(this.#activateCode);
    this.#AuthView.activateButtonDisplay({ canLogin: this.#activateCodeValid });
  };

  handleActivateBlurCode = () =>
    !isActivateCodeValid(this.#activateCode) &&
    this.#AuthView.activateWarningMessage({ isError: true, field: 'code' });

  #resetActivateEmailKit = () => {
    this.#activateEmail = '';
    this.#activateEmailValid = false;
    this.#activateEmailLoading = false;
  };

  #resetActivateCodeKit = () => {
    this.#activateCode = '';
    this.#activateCodeValid = false;
    this.#activateCodeLoading = false;
  };

  #handleActivateGetCode = catchAsync({
    filename,
    onProcess: async () => {
      if (this.#activateEmailLoading) return;

      this.#AuthView.activateActionDisplay({ state: LOADING });
      this.#activateEmailLoading = true;

      await authService.activateGetCode('/api/v1/users/activateCode', {
        email: this.#activateEmail,
      });

      this.#AuthView.activateActionDisplay({ state: CONTENT });

      this.#AuthView.activateGetCodeSuccess();
      this.#resetActivateEmailKit();

      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Activate code is sent to your email! Please check.',
      });
    },
    onError: error => {
      this.#activateEmailLoading = false;

      if (error.code === ERROR_ABORT_CODE) {
        this.#resetActivateEmailKit();
        return this.#AuthView.activateActionDisplay({ state: CONTENT });
      }

      let errorMessage = 'Something went wrong! Please try again.';

      if (error.response) {
        const { code, message } = error.response.data;
        [
          'ACTIVATE_AUTHENTICATION_ERROR',
          'ACTIVATE_OAUTH_ERROR',
          'ACTIVATE_ACTIVE_ERROR',
        ].includes(code) && (errorMessage = message);
      }

      this.#AuthView.activateActionDisplay({ state: ERROR, errorMessage });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  #handleActivateConfirmCode = catchAsync({
    filename,
    onProcess: async () => {
      if (this.#activateCodeLoading) return;

      this.#AuthView.activateActionDisplay({ state: LOADING });
      this.#activateCodeLoading = true;

      await authService.activateConfirmCode('/api/v1/users/activate', {
        token: this.#activateCode,
      });

      this.#AuthView.activateActionDisplay({ state: CONTENT });

      this.#resetActivateCodeKit();
      this.handleActivateClose();
      setTimeout(() => this.handleLoginOpen(), ANIMATION_TIMEOUT * 2);

      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Activate successfully!',
      });
    },
    onError: error => {
      this.#activateCodeLoading = false;

      if (error.code === ERROR_ABORT_CODE) {
        this.#resetActivateCodeKit();
        return this.#AuthView.activateActionDisplay({ state: CONTENT });
      }

      let errorMessage = 'Something went wrong! Please try again.';

      if (error.response) {
        const { code, message } = error.response.data;
        ['ACTIVATE_TOKEN_ERROR'].includes(code) && (errorMessage = message);
      }

      this.#AuthView.activateActionDisplay({ state: ERROR, errorMessage });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  handleActivate = () => {
    if (this.#activateEmailValid) this.#handleActivateGetCode();
    if (this.#activateCodeValid) this.#handleActivateConfirmCode();
  };

  handleActivateActionsBack = () => {
    if (this.#activateCodeLoading) return;
    this.#resetActivateCodeKit();
    this.#AuthView.activateGetCodeSuccess({ goBack: true });
  };

  // Forgot name //////////

  handleForgotNameClose = () => {
    authService.forgotNameAbort();
    super.close(this.#handleCloseModal, this.#AuthView.forgotNameClose);
  };

  handleForgotNameWarning = () =>
    this.#ToastView.createToast({
      ...store.state.toast[TOAST_WARNING],
      content:
        "Only get username of accounts created manually! (Don't support OAuth.)",
    });

  handleForgotNameEnterEmail = email => {
    this.#AuthView.forgotNameWarningMessage({ isError: false, field: 'email' });
    this.#forgotNameEmail = email.trim();
    this.#forgotNameEmailValid = isEmailValid(this.#forgotNameEmail);
    this.#AuthView.forgotNameButtonDisplay({
      canLogin: this.#forgotNameEmailValid,
    });
  };

  handleForgotNameBlurEmail = () =>
    !isEmailValid(this.#forgotNameEmail) &&
    this.#AuthView.forgotNameWarningMessage({ isError: true, field: 'email' });

  #resetForgotNameEmailKit = () => {
    this.#forgotNameEmail = '';
    this.#forgotNameEmailValid = false;
    this.#forgotNameEmailLoading = false;
  };

  handleForgotName = catchAsync({
    filename,
    onProcess: async () => {
      if (!this.#forgotNameEmailValid || this.#forgotNameEmailLoading) return;

      this.#AuthView.forgotNameActionDisplay({ state: LOADING });
      this.#forgotNameEmailLoading = true;

      await authService.forgotName('/api/v1/users/forgotUsername', {
        email: this.#forgotNameEmail,
      });

      this.#AuthView.forgotNameActionDisplay({ state: CONTENT });
      this.#resetForgotNameEmailKit();
      this.handleForgotNameClose();
      setTimeout(() => this.handleLoginOpen(), ANIMATION_TIMEOUT * 2);

      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Username is sent to your email! Please check.',
      });
    },
    onError: error => {
      this.#forgotNameEmailLoading = false;

      if (error.code === ERROR_ABORT_CODE)
        return this.#AuthView.forgotNameActionDisplay({ state: CONTENT });

      let errorMessage = 'Something went wrong! Please try again.';

      if (error.response) {
        const { code, message } = error.response.data;
        [
          'FORGOT_USERNAME_AUTHENTICATION_ERROR',
          'FORGOT_USERNAME_OAUTH_ERROR',
        ].includes(code) && (errorMessage = message);
      }

      this.#AuthView.forgotNameActionDisplay({ state: ERROR, errorMessage });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  // Sign-up //////////

  handleSignupClose = () => {
    authService.signupAbort();
    authService.activateConfirmCodeAbort();
    super.close(this.#handleCloseModal, this.#AuthView.signupClose);
  };

  handleSignupWarning = () =>
    this.#ToastView.createToast({
      ...store.state.toast[TOAST_WARNING],
      content: 'Remember to check all information again before signing up.',
    });

  #checkSingupInfoValid = () =>
    isUsernameValid(this.#signupInfoUsername) &&
    isEmailValid(this.#signupInfoEmail) &&
    isPasswordValid(this.#signupInfoPassword);

  handleSignupEnterUsername = username => {
    this.#AuthView.signupWarningMessage({ isError: false, field: 'username' });
    this.#signupInfoUsername = username.trim();
    this.#signupInfoValid = this.#checkSingupInfoValid();
    this.#AuthView.signupButtonDisplay({ canLogin: this.#signupInfoValid });
  };

  handleSignupBlurUsername = () =>
    !isUsernameValid(this.#signupInfoUsername) &&
    this.#AuthView.signupWarningMessage({ isError: true, field: 'username' });

  handleSignupEnterEmail = email => {
    this.#AuthView.signupWarningMessage({ isError: false, field: 'email' });
    this.#signupInfoEmail = email.trim();
    this.#signupInfoValid = this.#checkSingupInfoValid();
    this.#AuthView.signupButtonDisplay({ canLogin: this.#signupInfoValid });
  };

  handleSignupBlurEmail = () =>
    !isEmailValid(this.#signupInfoEmail) &&
    this.#AuthView.signupWarningMessage({ isError: true, field: 'email' });

  handleSignupEnterPassword = password => {
    this.#AuthView.signupWarningMessage({ isError: false, field: 'password' });
    this.#signupInfoPassword = password;
    this.#signupInfoValid = this.#checkSingupInfoValid();
    this.#AuthView.signupButtonDisplay({ canLogin: this.#signupInfoValid });
  };

  handleSignupBlurPassword = () =>
    !isPasswordValid(this.#signupInfoPassword) &&
    this.#AuthView.signupWarningMessage({ isError: true, field: 'password' });

  handleSignupPasswordType = () => this.#AuthView.signupPasswordTypeDisplay();

  handleSignupEnterCode = code => {
    this.#AuthView.signupWarningMessage({ isError: false, field: 'code' });
    this.#signupCode = code.trim();
    this.#signupCodeValid = isActivateCodeValid(this.#signupCode);
    this.#AuthView.signupButtonDisplay({ canLogin: this.#signupCodeValid });
  };

  handleSignupBlurCode = () =>
    !isActivateCodeValid(this.#signupCode) &&
    this.#AuthView.signupWarningMessage({ isError: true, field: 'code' });

  #resetSignupInfoKit = () => {
    this.#signupInfoUsername = '';
    this.#signupInfoEmail = '';
    this.#signupInfoPassword = '';
    this.#signupInfoValid = false;
    this.#signupInfoLoading = false;
  };

  #resetSignupCodeKit = () => {
    this.#signupCode = '';
    this.#signupCodeValid = false;
    this.#signupCodeLoading = false;
  };

  #handleSignupInfo = catchAsync({
    filename,
    onProcess: async () => {
      if (this.#signupInfoLoading) return;

      this.#AuthView.signupActionDisplay({ state: LOADING });
      this.#signupInfoLoading = true;

      await authService.signup('/api/v1/users/signup', {
        username: this.#signupInfoUsername,
        email: this.#signupInfoEmail,
        password: this.#signupInfoPassword,
      });

      this.#AuthView.signupActionDisplay({ state: CONTENT });

      this.#resetSignupInfoKit();
      this.#AuthView.signupInfoSuccess();

      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Activate code is sent to your email! Please check.',
      });
    },
    onError: error => {
      this.#signupInfoLoading = false;

      if (error.code === ERROR_ABORT_CODE) {
        this.#resetSignupInfoKit();
        return this.#AuthView.signupActionDisplay({ state: CONTENT });
      }

      let errorMessage = 'Something went wrong! Please try again.';

      if (error.response) {
        const { code, message } = error.response.data;
        [
          'SIGNUP_USERNAME_ERROR',
          'SIGNUP_EMAIL_ERROR',
          'SIGNUP_SEND_EMAIL_ERROR',
        ].includes(code) && (errorMessage = message);
      }

      this.#AuthView.signupActionDisplay({ state: ERROR, errorMessage });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  #handleSignupCode = catchAsync({
    filename,
    onProcess: async () => {
      if (this.#signupCodeLoading) return;

      this.#AuthView.signupActionDisplay({ state: LOADING });
      this.#signupCodeLoading = true;

      await authService.activateConfirmCode('/api/v1/users/activate', {
        token: this.#signupCode,
      });

      this.#AuthView.signupActionDisplay({ state: CONTENT });
      this.#resetSignupCodeKit();
      this.handleSignupClose();
      setTimeout(() => this.handleLoginOpen(), ANIMATION_TIMEOUT * 2);

      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Activate successfully!',
      });
    },
    onError: error => {
      this.#signupCodeLoading = false;

      if (error.code === ERROR_ABORT_CODE) {
        this.#resetSignupCodeKit();
        return this.#AuthView.signupActionDisplay({ state: CONTENT });
      }

      let errorMessage = 'Something went wrong! Please try again.';

      if (error.response) {
        const { code, message } = error.response.data;
        ['ACTIVATE_TOKEN_ERROR'].includes(code) && (errorMessage = message);
      }

      this.#AuthView.signupActionDisplay({ state: ERROR, errorMessage });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  handleSignup = () => {
    if (this.#signupInfoValid) this.#handleSignupInfo();
    if (this.#signupCodeValid) this.#handleSignupCode();
  };

  handleSignupBack = () => {
    if (this.#signupCodeLoading) return;
    this.#resetSignupCodeKit();
    this.#AuthView.signupInfoSuccess({ goBack: true });
  };
}

export default AuthController;
