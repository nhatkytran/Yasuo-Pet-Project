import isUaWebView from 'is-ua-webview';

import {
  ENV,
  ANIMATION_TIMEOUT,
  CONTENT,
  ERROR,
  LOADING,
  TOAST_WELCOME,
  TOAST_SUCCESS,
  TOAST_FAIL,
  TOAST_WARNING,
  ERROR_ABORT_CODE,
} from '../config';

import {
  capitalizeWordsInSentence,
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

  #forgotPasswordEmail = '';
  #forgotPasswordEmailValid = false;
  #forgotPasswordEmailLoading = false;
  #forgotPasswordResetCode = '';
  #forgotPasswordResetNewPassword = '';
  #forgotPasswordResetValid = false;
  #forgotPasswordResetLoading = false;

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
      // When we choose Goole as login method, but instead login we click the back button
      // This will cause a bug that it selects the previous logged in account infor -> reload the page again will fix this problem
      const perfEntries = performance.getEntriesByType('navigation');
      if (perfEntries.length && perfEntries[0].type === 'back_forward')
        window.location.reload();

      super.open(this.#handleOpenModal, this.#AuthView.serverRunningOpen);

      if (await authService.checkAuthGoogle())
        return (window.location.href =
          window.location.origin + window.location.pathname);

      const isLoggedIn = await authService.checkIsLoggedIn();

      // Sometimes fetch too fast, so we need to wait a while for the modal open completely
      // And we also want user see page loading effect
      setTimeout(
        () => {
          super.close(
            this.#handleCloseModal,
            this.#AuthView.serverRunningClose
          );

          // Wait for server-running animation
          setTimeout(
            () => this.#ToastView.createToast(store.state.toast[TOAST_WELCOME]),
            ANIMATION_TIMEOUT
          );
        },
        ENV === 'development' ? ANIMATION_TIMEOUT * 2 : 7000
      );

      if (isLoggedIn) {
        this.#AuthView.loginSuccess();
        this.#AuthView.loginSuccessSignal(); // userController will fetch user's information
      }
    },
  });

  handleLoginOpen = () =>
    super.open(this.#handleOpenModal, this.#AuthView.loginOpen);

  handleLoginClose = () => {
    authService.loginAbort();
    super.close(this.#handleCloseModal, this.#AuthView.loginClose);
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
    this.#AuthView.loginButtonDisplay({ canSubmit: this.#loginValid });
  };

  handleLoginBlurUsername = () =>
    !isUsernameValid(this.#loginUsername) &&
    this.#AuthView.loginWarningMessage({ isError: true, field: 'username' });

  handleLoginEnterPassword = password => {
    this.#AuthView.loginWarningMessage({ isError: false, field: 'password' });
    this.#loginPassword = password;
    this.#loginValid = this.#checkLoginValid();
    this.#AuthView.loginButtonDisplay({ canSubmit: this.#loginValid });
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

      this.#loginLoading = true;
      this.#AuthView.loginActionDisplay({ state: LOADING });

      // jwt is saved by axios instance
      await authService.login({
        username: this.#loginUsername,
        password: this.#loginPassword,
      });

      this.#resetLoginKit();
      this.#AuthView.loginActionDisplay({ state: CONTENT });

      this.handleLoginClose();
      this.#AuthView.loginSuccess();
      this.#AuthView.loginSuccessSignal();

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
    // Open link directly in app like Zalo -> 403: disallowed_useragent error
    if (isUaWebView(window.navigator.userAgent))
      return this.#ToastView.createToast({
        ...store.state.toast[TOAST_FAIL],
        content: `Please use browsers like Chrome, Safari, Firefox,... to sign in with ${capitalizeWordsInSentence(
          social
        )}`,
      });

    if (['facebook', 'github', 'apple'].includes(social)) return;
    authService.loginSocial(social);
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

  handleLoginChooseForgotPassword = () =>
    setTimeout(
      () =>
        super.open(this.#handleOpenModal, this.#AuthView.forgotPasswordOpen),
      ANIMATION_TIMEOUT * 2
    );

  handleLoginChooseSignup = () =>
    setTimeout(
      () => super.open(this.#handleOpenModal, this.#AuthView.signupOpen),
      ANIMATION_TIMEOUT * 2
    );

  // Sign-out //////////

  handleLogout = () => {
    this.#AuthView.logoutActionDisplay(LOADING);
    authService.logout();

    setTimeout(() => {
      this.#AuthView.logoutSuccessSignal();
      this.#AuthView.logoutActionDisplay(CONTENT);
      this.#AuthView.logoutSuccess();
      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'See you later.',
      });
    }, ANIMATION_TIMEOUT);
  };

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
      canSubmit: this.#activateEmailValid,
    });
  };

  handleActivateBlurEmail = () =>
    !isEmailValid(this.#activateEmail) &&
    this.#AuthView.activateWarningMessage({ isError: true, field: 'email' });

  handleActivateEnterCode = code => {
    this.#AuthView.activateWarningMessage({ isError: false, field: 'code' });
    this.#activateCode = code.trim();
    this.#activateCodeValid = isActivateCodeValid(this.#activateCode);
    this.#AuthView.activateButtonDisplay({
      canSubmit: this.#activateCodeValid,
    });
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

      this.#activateEmailLoading = true;
      this.#AuthView.activateActionDisplay({ state: LOADING });

      await authService.activateGetCode({ email: this.#activateEmail });

      this.#resetActivateEmailKit();
      this.#AuthView.activateActionDisplay({ state: CONTENT });
      this.#AuthView.activateGetCodeSuccess();

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

      this.#activateCodeLoading = true;
      this.#AuthView.activateActionDisplay({ state: LOADING });

      await authService.activateConfirmCode({ token: this.#activateCode });

      this.#resetActivateCodeKit();
      this.#AuthView.activateActionDisplay({ state: CONTENT });
      this.handleActivateActionsBack();

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
        'if you sign in using OAuth, you can change your in-game name later.',
    });

  handleForgotNameEnterEmail = email => {
    this.#AuthView.forgotNameWarningMessage({ isError: false, field: 'email' });
    this.#forgotNameEmail = email.trim();
    this.#forgotNameEmailValid = isEmailValid(this.#forgotNameEmail);
    this.#AuthView.forgotNameButtonDisplay({
      canSubmit: this.#forgotNameEmailValid,
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

      this.#forgotNameEmailLoading = true;
      this.#AuthView.forgotNameActionDisplay({ state: LOADING });

      await authService.forgotName({ email: this.#forgotNameEmail });

      this.#resetForgotNameEmailKit();
      this.#AuthView.forgotNameActionDisplay({ state: CONTENT });

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
        ['FORGOT_USERNAME_AUTHENTICATION_ERROR'].includes(code) &&
          (errorMessage = message);
      }

      this.#AuthView.forgotNameActionDisplay({ state: ERROR, errorMessage });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  // Forgot password //////////

  handleForgotPasswordClose = () => {
    authService.forgotPasswordAbort();
    authService.forgotPasswordResetAbort();
    super.close(this.#handleCloseModal, this.#AuthView.forgotPasswordClose);
  };

  handleForgotPasswordWarning = () =>
    this.#ToastView.createToast({
      ...store.state.toast[TOAST_WARNING],
      content:
        "Only reset password of accounts created manually! (Don't support OAuth.)",
    });

  handleForgotPasswordEnterEmail = email => {
    this.#AuthView.forgotPasswordWarningMessage({
      isError: false,
      field: 'email',
    });
    this.#forgotPasswordEmail = email.trim();
    this.#forgotPasswordEmailValid = isEmailValid(this.#forgotPasswordEmail);
    this.#AuthView.forgotPasswordButtonDisplay({
      canSubmit: this.#forgotPasswordEmailValid,
    });
  };

  handleForgotPasswordBlurEmail = () =>
    !isEmailValid(this.#forgotPasswordEmail) &&
    this.#AuthView.forgotPasswordWarningMessage({
      isError: true,
      field: 'email',
    });

  #checkForgotPasswordResetValid = () =>
    isActivateCodeValid(this.#forgotPasswordResetCode) &&
    isPasswordValid(this.#forgotPasswordResetNewPassword);

  handleForgotPasswordEnterCode = code => {
    this.#AuthView.forgotPasswordWarningMessage({
      isError: false,
      field: 'code',
    });
    this.#forgotPasswordResetCode = code.trim();
    this.#forgotPasswordResetValid = this.#checkForgotPasswordResetValid();
    this.#AuthView.forgotPasswordButtonDisplay({
      canSubmit: this.#forgotPasswordResetValid,
    });
  };

  handleForgotPasswordBlurCode = () =>
    !isActivateCodeValid(this.#forgotPasswordResetCode) &&
    this.#AuthView.forgotPasswordWarningMessage({
      isError: true,
      field: 'code',
    });

  handleForgotPasswordEnterNewPassword = newPassword => {
    this.#AuthView.forgotPasswordWarningMessage({
      isError: false,
      field: 'new_password',
    });
    this.#forgotPasswordResetNewPassword = newPassword;
    this.#forgotPasswordResetValid = this.#checkForgotPasswordResetValid();
    this.#AuthView.forgotPasswordButtonDisplay({
      canSubmit: this.#forgotPasswordResetValid,
    });
  };

  handleForgotPasswordBlurNewPassword = () =>
    !isPasswordValid(this.#forgotPasswordResetNewPassword) &&
    this.#AuthView.forgotPasswordWarningMessage({
      isError: true,
      field: 'new_password',
    });

  handleForgotPasswordNewPasswordType = () =>
    this.#AuthView.forgotPasswordNewPasswordTypeDisplay();

  #resetForgotPasswordEmailKit = () => {
    this.#forgotPasswordEmail = '';
    this.#forgotPasswordEmailValid = false;
    this.#forgotPasswordEmailLoading = false;
  };

  #resetForgotPasswordResetlKit = () => {
    this.#forgotPasswordResetCode = '';
    this.#forgotPasswordResetNewPassword = '';
    this.#forgotPasswordResetValid = false;
    this.#forgotPasswordResetLoading = false;
  };

  #handleForgotPasswordGetCode = catchAsync({
    filename,
    onProcess: async () => {
      if (this.#forgotPasswordEmailLoading) return;

      this.#forgotPasswordEmailLoading = true;
      this.#AuthView.forgotPasswordActionDisplay({ state: LOADING });

      await authService.forgotPassword({ email: this.#forgotPasswordEmail });

      this.#resetForgotPasswordEmailKit();
      this.#AuthView.forgotPasswordActionDisplay({ state: CONTENT });
      this.#AuthView.forgotPasswordGetCodeSuccess();

      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Reset password code is sent to your email! Please check.',
      });
    },
    onError: error => {
      this.#forgotPasswordEmailLoading = false;

      if (error.code === ERROR_ABORT_CODE) {
        this.#resetForgotPasswordEmailKit();
        return this.#AuthView.forgotPasswordActionDisplay({ state: CONTENT });
      }

      let errorMessage = 'Something went wrong! Please try again.';

      if (error.response) {
        const { code, message } = error.response.data;
        [
          'FORGOT_PASSWORD_AUTHENTICATION_ERROR',
          'FORGOT_PASSWORD_OAUTH_ERROR',
          'FORGOT_PASSWORD_SEND_EMAIL_ERROR',
        ].includes(code) && (errorMessage = message);
      }

      this.#AuthView.forgotPasswordActionDisplay({
        state: ERROR,
        errorMessage,
      });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  #handleForgotPasswordConfirmCode = catchAsync({
    filename,
    onProcess: async () => {
      if (this.#forgotPasswordResetLoading) return;

      this.#forgotPasswordResetLoading = true;
      this.#AuthView.forgotPasswordActionDisplay({ state: LOADING });

      await authService.forgotPasswordReset({
        token: this.#forgotPasswordResetCode,
        newPassword: this.#forgotPasswordResetNewPassword,
      });

      this.#resetForgotPasswordResetlKit();
      this.#AuthView.forgotPasswordActionDisplay({ state: CONTENT });
      this.handleForgotPasswordBack();

      this.handleForgotPasswordClose();
      setTimeout(() => this.handleLoginOpen(), ANIMATION_TIMEOUT * 2);

      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Change password successfully!',
      });
    },
    onError: error => {
      this.#forgotPasswordResetLoading = false;

      if (error.code === ERROR_ABORT_CODE) {
        this.#resetForgotPasswordResetlKit();
        return this.#AuthView.forgotPasswordActionDisplay({ state: CONTENT });
      }

      let errorMessage = 'Something went wrong! Please try again.';

      if (error.response) {
        const { code, message } = error.response.data;
        ['FORGOT_PASSWORD_TOKEN_ERROR'].includes(code) &&
          (errorMessage = message);
      }

      this.#AuthView.forgotPasswordActionDisplay({
        state: ERROR,
        errorMessage,
      });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  handleForgotPassword = () => {
    if (this.#forgotPasswordEmailValid) this.#handleForgotPasswordGetCode();
    if (this.#forgotPasswordResetValid) this.#handleForgotPasswordConfirmCode();
  };

  handleForgotPasswordBack = () => {
    if (this.#forgotPasswordResetLoading) return;
    this.#resetForgotPasswordResetlKit();
    this.#AuthView.forgotPasswordGetCodeSuccess({ goBack: true });
  };

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
    this.#AuthView.signupButtonDisplay({ canSubmit: this.#signupInfoValid });
  };

  handleSignupBlurUsername = () =>
    !isUsernameValid(this.#signupInfoUsername) &&
    this.#AuthView.signupWarningMessage({ isError: true, field: 'username' });

  handleSignupEnterEmail = email => {
    this.#AuthView.signupWarningMessage({ isError: false, field: 'email' });
    this.#signupInfoEmail = email.trim();
    this.#signupInfoValid = this.#checkSingupInfoValid();
    this.#AuthView.signupButtonDisplay({ canSubmit: this.#signupInfoValid });
  };

  handleSignupBlurEmail = () =>
    !isEmailValid(this.#signupInfoEmail) &&
    this.#AuthView.signupWarningMessage({ isError: true, field: 'email' });

  handleSignupEnterPassword = password => {
    this.#AuthView.signupWarningMessage({ isError: false, field: 'password' });
    this.#signupInfoPassword = password;
    this.#signupInfoValid = this.#checkSingupInfoValid();
    this.#AuthView.signupButtonDisplay({ canSubmit: this.#signupInfoValid });
  };

  handleSignupBlurPassword = () =>
    !isPasswordValid(this.#signupInfoPassword) &&
    this.#AuthView.signupWarningMessage({ isError: true, field: 'password' });

  handleSignupPasswordType = () => this.#AuthView.signupPasswordTypeDisplay();

  handleSignupEnterCode = code => {
    this.#AuthView.signupWarningMessage({ isError: false, field: 'code' });
    this.#signupCode = code.trim();
    this.#signupCodeValid = isActivateCodeValid(this.#signupCode);
    this.#AuthView.signupButtonDisplay({ canSubmit: this.#signupCodeValid });
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

      this.#signupInfoLoading = true;
      this.#AuthView.signupActionDisplay({ state: LOADING });

      await authService.signup({
        username: this.#signupInfoUsername,
        email: this.#signupInfoEmail,
        password: this.#signupInfoPassword,
        passwordConfirm: this.#signupInfoPassword,
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

      await authService.activateConfirmCode({ token: this.#signupCode });

      this.#resetSignupCodeKit();
      this.#AuthView.signupActionDisplay({ state: CONTENT });
      this.handleSignupBack();

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
