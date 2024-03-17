import {
  ADD,
  REMOVE,
  CONTENT,
  LOADING,
  ERROR,
  START,
  END,
  FADE_IN,
  LOGIN_SUCCESS_SIGNAL,
  LOGOUT_SUCCESS_SIGNAL,
} from '../config';

import {
  $,
  $_,
  $$_,
  animateFactory,
  classRemove,
  passwordTypeDisplayFactory,
  resetPasswordInput,
} from '../utils';

const loginWarningMessageClass = '.login-form__header-warning-message';
const disabledCssText = `opacity: 0.6; cursor: not-allowed;`;
const activateWarningMessageClass = '.activate-form__header-warning-message';
const forgotNameWarningMessageClass =
  '.forgot-name-form__header-warning-message';
const forgotPasswordWarningMessageClass =
  '.forgot-password-form__header-warning-message';
const signupWarningMessageClass = '.signup-form__header-warning-message';

const animateOptions = { start: FADE_IN, end: 'fade-out-480' };

class AuthView {
  // Server running //////////
  #serverRunning = $('.server-running');

  // Sign-in //////////

  #loginSection = $('.login-overlay');
  #loginForm = $('#login-form');

  #loginOpenButtonSubHeader = $('.sub-header__content-login');
  #loginOpenButtonMainHeader = $('.main-header__play-sign-in');
  #loginUserName = $('.user__info-name');

  #loginExitButton = $('.login-form__header-hero-close');

  #loginWarningButton = $('.login-form__header-warning-button');
  #loginWarningMessageUsername = $(`${loginWarningMessageClass}-username`);
  #loginWarningMessagePassword = $(`${loginWarningMessageClass}-password`);
  #loginWarningMessageFail = $(`${loginWarningMessageClass}-fail`);
  #loginUsernameInput = $('#login-form-username');
  #loginPasswordInput = $('#login-form-password');
  #loginPasswordTypeButton = $('.login-form-password__type-button');

  #loginButton = $('.login-form__body-button');

  #loginButtonSocialWrapper = $('.login-form__options');
  #loginForgotNameButton = $('.login-form__actions-forgot-name');
  #loginForgotPasswordButton = $('.login-form__actions-forgot-password');
  #loginActivateButton = $('.login-form__actions-activate-account');
  #loginSignupButton = $('.login-form__actions-sign-up');

  // Sign-out //////////

  #logoutButtonSubHeader = $('.sub-header__content-logout');
  #userAvatarWrapper = $('.yasuo-round');
  #userAvatarSrc = $_(this.#userAvatarWrapper, 'img').src;

  // Activate //////////

  #activateSection = $('.activate-overlay');
  #activateForm = $('#activate-form');

  #activateExitButton = $('.activate-form__header-hero-close');
  #activateHeaderTitle = $('.activate-form__header-title');

  #activateWarningButton = $('.activate-form__header-warning-button');
  #activateWarningMessageEmail = $(`${activateWarningMessageClass}-email`);
  #activateWarningMessageCode = $(`${activateWarningMessageClass}-code`);
  #activateWarningMessageFail = $(`${activateWarningMessageClass}-fail`);
  #activateEmailInput = $('#activate-form-email');
  #activateCodeInput = $('#activate-form-code');

  #activateButton = $('.activate-form__body-button');

  #activateActionsWrapper = $('.activate-form__actions-wrapper');
  #activateActionsBackWrapper = $('.activate-form__actions-back-wrapper');
  #activateActionsBackButton = $('.activate-form__actions-back-button');

  // Forgot name //////////

  #forgotNameSection = $('.forgot-name-overlay');
  #forgotNameForm = $('#forgot-name-form');

  #forgotNameExitButton = $('.forgot-name-form__header-hero-close');

  #forgotNameWarningButton = $('.forgot-name-form__header-warning-button');
  #forgotNameWarningMessageEmail = $(`${forgotNameWarningMessageClass}-email`);
  #forgotNameWarningMessageFail = $(`${forgotNameWarningMessageClass}-fail`);
  #forgotNameEmailInput = $('#forgot-name-form-email');

  #forgotNameButton = $('.forgot-name-form__body-button');

  // Forgot password //////////

  #forgotPasswordSection = $('.forgot-password-overlay');
  #forgotPasswordForm = $('#forgot-password-form');

  #forgotPasswordExitButton = $('.forgot-password-form__header-hero-close');
  #forgotPasswordWarningButton = $(
    '.forgot-password-form__header-warning-button'
  );

  #forgotPasswordWarningMessageEmail = $(
    `${forgotPasswordWarningMessageClass}-email`
  );
  #forgotPasswordWarningMessageCode = $(
    `${forgotPasswordWarningMessageClass}-code`
  );
  #forgotPasswordWarningMessageNewPassword = $(
    `${forgotPasswordWarningMessageClass}-new-password`
  );
  #forgotPasswordWarningMessageFail = $(
    `${forgotPasswordWarningMessageClass}-fail`
  );

  #forgotPasswordEmailInput = $('#forgot-password-form-email');
  #forgotPasswordCodeInput = $('#forgot-password-form-code');
  #forgotPasswordNewPasswordInput = $('#forgot-password-form-new-password');
  #forgotPasswordNewPasswordTypeButton = $(
    '.forgot-password-form-new-password__type-button'
  );

  #forgotPasswordButton = $('.forgot-password-form__body-button');

  #forgotPasswordActionsWrapper = $('.forgot-password-form__actions-wrapper');
  #forgotPasswordActionsBackWrapper = $(
    '.forgot-password-form__actions-back-wrapper'
  );
  #forgotPasswordActionsBackButton = $(
    '.forgot-password-form__actions-back-button'
  );

  // Sign-up //////////

  #signupSection = $('.signup-overlay');
  #signupForm = $('#signup-form');

  #signupExitButton = $('.signup-form__header-hero-close');
  #signupHeaderTitle = $('.signup-form__header-title');

  #signupWarningButton = $('.signup-form__header-warning-button');
  #signupWarningMessageUsername = $(`${signupWarningMessageClass}-username`);
  #signupWarningMessageEmail = $(`${signupWarningMessageClass}-email`);
  #signupWarningMessagePassword = $(`${signupWarningMessageClass}-password`);
  #signupWarningMessageCode = $(`${signupWarningMessageClass}-code`);
  #signupWarningMessageFail = $(`${signupWarningMessageClass}-fail`);

  #signupUsernameInput = $('#signup-form-username');
  #signupEmailInput = $('#signup-form-email');
  #signupPasswordInput = $('#signup-form-password');
  #signupCodeInput = $('#signup-form-code');
  #signupPasswordTypeButton = $('.signup-form-password__type-button');

  #signupButton = $('.signup-form__body-button');

  #signupSigninButton = $('.signup-form__actions-wrapper-signin');
  #signupBackButton = $('.signup-form__actions-wrapper-back');

  //

  #animateLoginSection = animateFactory(this.#loginSection, animateOptions);
  #animateActivateSection = animateFactory(
    this.#activateSection,
    animateOptions
  );
  #animateForgotNameSection = animateFactory(
    this.#forgotNameSection,
    animateOptions
  );
  #animateForgotPasswordSection = animateFactory(
    this.#forgotPasswordSection,
    animateOptions
  );
  #animateSignupSection = animateFactory(this.#signupSection, animateOptions);

  // Helpers

  #mainButtonDisplayFactory = button => {
    return ({ canSubmit }) =>
      (button.style.cssText = canSubmit
        ? `opacity: 1; cursor: pointer;`
        : disabledCssText);
  };

  #mainButtonLoadingDisplay = (isLoading, button) => {
    const holdIndex = isLoading ? 1 : 0;
    $$_(button, 'svg').forEach((svg, index) =>
      classRemove(index === holdIndex ? REMOVE : ADD, svg)
    );
  };

  #adjustTopPosition = (element, scrollVertical) =>
    (element.style.cssText = `top: ${scrollVertical ?? 0}px`);

  // Server running //////////

  serverRunning = state =>
    classRemove(state === START ? REMOVE : ADD, this.#serverRunning);

  // Sign-in //////////

  loginOpen = scrollVertical => {
    this.#adjustTopPosition(this.#loginSection, scrollVertical);
    classRemove(REMOVE, this.#loginSection);
    this.#animateLoginSection(START);
  };

  loginClose = () => {
    this.#adjustTopPosition(this.#loginSection);
    classRemove(ADD, this.#loginSection);
    this.#animateLoginSection(END);
  };

  loginSuccess = () => {
    classRemove(
      ADD,
      this.#loginOpenButtonSubHeader,
      this.#loginOpenButtonMainHeader
    );
    classRemove(REMOVE, this.#loginUserName, this.#logoutButtonSubHeader);
  };

  loginSuccessSignal = () =>
    this.#loginUserName.dispatchEvent(
      new CustomEvent(LOGIN_SUCCESS_SIGNAL, {
        detail: 'log_in',
      })
    );

  loginWarningMessage = ({ isError, field }) => {
    classRemove(ADD, this.#loginWarningMessageFail);

    if (isError) {
      if (field === 'username')
        this.#loginWarningMessageUsername.textContent =
          'Username must be 5+ characters.';

      if (field === 'password')
        this.#loginWarningMessagePassword.textContent =
          'Password: 8+ chars (uppercase, lowercase, number, symbol).';

      return classRemove(ADD, this.#loginWarningButton);
    }

    if (field === 'username')
      this.#loginWarningMessageUsername.textContent = '';
    if (field === 'password')
      this.#loginWarningMessagePassword.textContent = '';

    if (
      this.#loginWarningMessageUsername.textContent === '' &&
      this.#loginWarningMessagePassword.textContent === ''
    )
      classRemove(REMOVE, this.#loginWarningButton);
  };

  loginButtonDisplay = this.#mainButtonDisplayFactory(this.#loginButton);

  loginPasswordTypeDisplay = passwordTypeDisplayFactory(
    this.#loginPasswordInput,
    this.#loginPasswordTypeButton
  );

  loginActionDisplay = ({ state, errorMessage }) => {
    const inputs = [this.#loginUsernameInput, this.#loginPasswordInput];

    if (state === LOADING) {
      inputs.forEach(input => {
        input.disabled = true;
        input.style.cssText = disabledCssText;
      });

      this.#mainButtonLoadingDisplay(true, this.#loginButton);
      return (this.#loginButton.style.cssText = disabledCssText);
    }

    inputs.forEach(input => {
      input.disabled = false;
      input.style.cssText = `opacity: 1; cursor: text;`;
    });
    this.#mainButtonLoadingDisplay(false, this.#loginButton);

    if (state === ERROR) {
      classRemove(ADD, this.#loginWarningButton);
      this.#loginWarningMessageFail.textContent = errorMessage;
      classRemove(REMOVE, this.#loginWarningMessageFail);
      this.#loginButton.style.cssText = `opacity: 1; cursor: pointer;`;
    }

    if (state === CONTENT) {
      resetPasswordInput(
        this.#loginPasswordInput,
        this.#loginPasswordTypeButton
      );
      inputs.forEach(input => (input.value = ''));
      classRemove(REMOVE, this.#loginWarningButton);
      classRemove(ADD, this.#loginWarningMessageFail);
      this.#loginWarningMessageUsername.textContent = '';
      this.#loginWarningMessagePassword.textContent = '';
    }
  };

  // Sign-out //////////

  logoutActionDisplay = state => {
    let documentCursor;
    let bodyStyle;

    if (state === LOADING) {
      documentCursor = 'wait';
      bodyStyle = `pointer-events: none; filter: brightness(0.4); opacity: 0.8;`;
    }
    if (state === CONTENT || state === ERROR) {
      documentCursor = 'default';
      bodyStyle = `pointer-events: unset; filter: unset; opacity: unset;`;
    }

    document.documentElement.style.cursor = documentCursor;
    document.body.style.cssText = bodyStyle;
  };

  logoutSuccess = () => {
    classRemove(
      REMOVE,
      this.#loginOpenButtonSubHeader,
      this.#loginOpenButtonMainHeader
    );

    classRemove(ADD, this.#loginUserName, this.#logoutButtonSubHeader);

    const image = document.createElement('img');
    image.src = this.#userAvatarSrc;

    image.addEventListener('load', () => {
      this.#userAvatarWrapper.innerHTML = '';
      this.#userAvatarWrapper.appendChild(image);
    });
  };

  logoutSuccessSignal = () =>
    this.#loginUserName.dispatchEvent(
      new CustomEvent(LOGOUT_SUCCESS_SIGNAL, {
        detail: 'log_out',
      })
    );

  // Activate //////////

  activateOpen = scrollVertical => {
    this.#adjustTopPosition(this.#activateSection, scrollVertical);
    classRemove(REMOVE, this.#activateSection);
    this.#animateActivateSection(START);
  };

  activateClose = () => {
    this.#adjustTopPosition(this.#activateSection);
    classRemove(ADD, this.#activateSection);
    this.#animateActivateSection(END);
  };

  activateWarningMessage = ({ isError, field }) => {
    classRemove(ADD, this.#activateWarningMessageFail);

    if (isError) {
      if (field === 'email')
        this.#activateWarningMessageEmail.textContent =
          'Please provide a valid email.';

      if (field === 'code')
        this.#activateWarningMessageCode.textContent =
          'Please provide a valid code';

      return classRemove(ADD, this.#activateWarningButton);
    }

    if (field === 'email') this.#activateWarningMessageEmail.textContent = '';
    if (field === 'code') this.#activateWarningMessageCode.textContent = '';
    classRemove(REMOVE, this.#activateWarningButton);
  };

  activateButtonDisplay = this.#mainButtonDisplayFactory(this.#activateButton);

  activateActionDisplay = ({ state, errorMessage }) => {
    const inputs = [this.#activateEmailInput, this.#activateCodeInput];

    if (state === LOADING) {
      inputs.forEach(input => {
        input.disabled = true;
        input.style.cssText = disabledCssText;
      });

      this.#activateActionsBackButton.style.cursor = 'not-allowed';
      this.#mainButtonLoadingDisplay(true, this.#activateButton);
      return (this.#activateButton.style.cssText = disabledCssText);
    }

    inputs.forEach(input => {
      input.disabled = false;
      input.style.cssText = `opacity: 1; cursor: text;`;
    });
    this.#activateActionsBackButton.style.cursor = 'pointer';
    this.#mainButtonLoadingDisplay(false, this.#activateButton);

    if (state === ERROR) {
      classRemove(ADD, this.#activateWarningButton);
      this.#activateWarningMessageFail.textContent = errorMessage;
      classRemove(REMOVE, this.#activateWarningMessageFail);
      this.#activateButton.style.cssText = `opacity: 1; cursor: pointer;`;
    }

    if (state === CONTENT) {
      inputs.forEach(input => (input.value = ''));
      classRemove(REMOVE, this.#activateWarningButton);
      classRemove(ADD, this.#activateWarningMessageFail);
      this.#activateWarningMessageEmail.textContent = '';
      this.#activateWarningMessageCode.textContent = '';
    }
  };

  activateGetCodeSuccess = (option = {}) => {
    const { goBack } = option;
    this.#activateHeaderTitle.textContent = goBack ? 'Activate' : 'Code';

    classRemove(
      goBack ? REMOVE : ADD,
      this.#activateEmailInput.parentElement,
      this.#activateActionsWrapper
    );

    classRemove(
      goBack ? ADD : REMOVE,
      this.#activateCodeInput.parentElement,
      this.#activateActionsBackWrapper
    );

    if (goBack) {
      this.#activateCodeInput.value = '';
      classRemove(REMOVE, this.#activateWarningButton);
      classRemove(ADD, this.#activateWarningMessageFail);
      this.#activateWarningMessageCode.textContent = '';
      this.#activateButton.style.cssText = disabledCssText;
    }
  };

  // Forgot name //////////

  forgotNameOpen = scrollVertical => {
    this.#adjustTopPosition(this.#forgotNameSection, scrollVertical);
    classRemove(REMOVE, this.#forgotNameSection);
    this.#animateForgotNameSection(START);
  };

  forgotNameClose = () => {
    this.#adjustTopPosition(this.#forgotNameSection);
    classRemove(ADD, this.#forgotNameSection);
    this.#animateForgotNameSection(END);
  };

  forgotNameWarningMessage = ({ isError, field }) => {
    classRemove(ADD, this.#forgotNameWarningMessageFail);

    if (isError) {
      if (field === 'email')
        this.#forgotNameWarningMessageEmail.textContent =
          'Please provide a valid email.';

      return classRemove(ADD, this.#forgotNameWarningButton);
    }

    if (field === 'email') this.#forgotNameWarningMessageEmail.textContent = '';
    classRemove(REMOVE, this.#forgotNameWarningButton);
  };

  forgotNameButtonDisplay = this.#mainButtonDisplayFactory(
    this.#forgotNameButton
  );

  forgotNameActionDisplay = ({ state, errorMessage }) => {
    if (state === LOADING) {
      this.#forgotNameEmailInput.disabled = true;
      this.#forgotNameEmailInput.style.cssText = disabledCssText;
      this.#mainButtonLoadingDisplay(true, this.#forgotNameButton);
      return (this.#forgotNameButton.style.cssText = disabledCssText);
    }

    this.#forgotNameEmailInput.disabled = false;
    this.#forgotNameEmailInput.style.cssText = `opacity: 1; cursor: text;`;
    this.#mainButtonLoadingDisplay(false, this.#forgotNameButton);

    if (state === ERROR) {
      classRemove(ADD, this.#forgotNameWarningButton);
      this.#forgotNameWarningMessageFail.textContent = errorMessage;
      classRemove(REMOVE, this.#forgotNameWarningMessageFail);
      this.#forgotNameButton.style.cssText = `opacity: 1; cursor: pointer;`;
    }

    if (state === CONTENT) {
      this.#forgotNameEmailInput.value = '';
      classRemove(REMOVE, this.#forgotNameWarningButton);
      classRemove(ADD, this.#forgotNameWarningMessageFail);
      this.#forgotNameWarningMessageEmail.textContent = '';
    }
  };

  // Forgot password //////////

  forgotPasswordOpen = scrollVertical => {
    this.#adjustTopPosition(this.#forgotPasswordSection, scrollVertical);
    classRemove(REMOVE, this.#forgotPasswordSection);
    this.#animateForgotPasswordSection(START);
  };

  forgotPasswordClose = () => {
    this.#adjustTopPosition(this.#forgotPasswordSection);
    classRemove(ADD, this.#forgotPasswordSection);
    this.#animateForgotPasswordSection(END);
  };

  forgotPasswordWarningMessage = ({ isError, field }) => {
    classRemove(ADD, this.#forgotPasswordWarningMessageFail);

    if (isError) {
      if (field === 'email')
        this.#forgotPasswordWarningMessageEmail.textContent =
          'Please provide a valid email.';

      if (field === 'code')
        this.#forgotPasswordWarningMessageCode.textContent =
          'Please provide a valid code';

      if (field === 'new_password')
        this.#forgotPasswordWarningMessageNewPassword.textContent =
          'Password: 8+ chars (uppercase, lowercase, number, symbol).';

      return classRemove(ADD, this.#forgotPasswordWarningButton);
    }

    if (field === 'email')
      this.#forgotPasswordWarningMessageEmail.textContent = '';
    if (field === 'code')
      this.#forgotPasswordWarningMessageCode.textContent = '';
    if (field === 'new_password')
      this.#forgotPasswordWarningMessageNewPassword.textContent = '';

    if (field === 'email')
      classRemove(REMOVE, this.#forgotPasswordWarningButton);
    else if (
      this.#forgotPasswordWarningMessageCode.textContent === '' &&
      this.#forgotPasswordWarningMessageNewPassword.textContent === ''
    )
      classRemove(REMOVE, this.#forgotPasswordWarningButton);
  };

  forgotPasswordButtonDisplay = this.#mainButtonDisplayFactory(
    this.#forgotPasswordButton
  );

  forgotPasswordNewPasswordTypeDisplay = passwordTypeDisplayFactory(
    this.#forgotPasswordNewPasswordInput,
    this.#forgotPasswordNewPasswordTypeButton
  );

  forgotPasswordActionDisplay = ({ state, errorMessage }) => {
    const inputs = [
      this.#forgotPasswordEmailInput,
      this.#forgotPasswordCodeInput,
      this.#forgotPasswordNewPasswordInput,
    ];

    if (state === LOADING) {
      inputs.forEach(input => {
        input.disabled = true;
        input.style.cssText = disabledCssText;
      });

      this.#forgotPasswordActionsBackButton.style.cursor = 'not-allowed';
      this.#mainButtonLoadingDisplay(true, this.#forgotPasswordButton);
      return (this.#forgotPasswordButton.style.cssText = disabledCssText);
    }

    inputs.forEach(input => {
      input.disabled = false;
      input.style.cssText = `opacity: 1; cursor: text;`;
    });
    this.#forgotPasswordActionsBackButton.style.cursor = 'pointer';
    this.#mainButtonLoadingDisplay(false, this.#forgotPasswordButton);

    if (state === ERROR) {
      classRemove(ADD, this.#forgotPasswordWarningButton);
      classRemove(REMOVE, this.#forgotPasswordWarningMessageFail);
      this.#forgotPasswordWarningMessageFail.textContent = errorMessage;
      this.#forgotPasswordButton.style.cssText = `opacity: 1; cursor: pointer;`;
    }

    if (state === CONTENT) {
      resetPasswordInput(
        this.#forgotPasswordNewPasswordInput,
        this.#forgotPasswordNewPasswordTypeButton
      );
      inputs.forEach(input => (input.value = ''));
      classRemove(REMOVE, this.#forgotPasswordWarningButton);
      classRemove(ADD, this.#forgotPasswordWarningMessageFail);
      this.#forgotPasswordWarningMessageEmail.textContent = '';
      this.#forgotPasswordWarningMessageCode.textContent = '';
      this.#forgotPasswordWarningMessageNewPassword.textContent = '';
    }
  };

  forgotPasswordGetCodeSuccess = (option = {}) => {
    const { goBack } = option;

    classRemove(
      goBack ? REMOVE : ADD,
      this.#forgotPasswordEmailInput.parentElement,
      this.#forgotPasswordActionsWrapper
    );

    classRemove(
      goBack ? ADD : REMOVE,
      this.#forgotPasswordCodeInput.parentElement,
      this.#forgotPasswordNewPasswordInput.parentElement,
      this.#forgotPasswordActionsBackWrapper
    );

    if (goBack) {
      classRemove(REMOVE, this.#forgotPasswordWarningButton);
      classRemove(ADD, this.#forgotPasswordWarningMessageFail);
      this.#forgotPasswordWarningMessageCode.textContent = '';
      this.#forgotPasswordWarningMessageNewPassword.textContent = '';
      this.#forgotPasswordCodeInput.value = '';
      this.#forgotPasswordNewPasswordInput.value = '';
      this.#forgotPasswordButton.style.cssText = disabledCssText;
    }
  };

  // Sign-up //////////

  signupOpen = scrollVertical => {
    this.#adjustTopPosition(this.#signupSection, scrollVertical);
    classRemove(REMOVE, this.#signupSection);
    this.#animateSignupSection(START);
  };

  signupClose = () => {
    this.#adjustTopPosition(this.#signupSection);
    classRemove(ADD, this.#signupSection);
    this.#animateSignupSection(END);
  };

  signupWarningMessage = ({ isError, field }) => {
    classRemove(ADD, this.#signupWarningMessageFail);

    if (isError) {
      if (field === 'username')
        this.#signupWarningMessageUsername.textContent =
          'Username must be 5+ characters.';

      if (field === 'email')
        this.#signupWarningMessageEmail.textContent =
          'Please provide a valid email.';

      if (field === 'password')
        this.#signupWarningMessagePassword.textContent =
          'Password: 8+ chars (uppercase, lowercase, number, symbol).';

      if (field === 'code')
        this.#signupWarningMessageCode.textContent =
          'Please provide a valid code';

      return classRemove(ADD, this.#signupWarningButton);
    }

    if (field === 'username')
      this.#signupWarningMessageUsername.textContent = '';
    if (field === 'email') this.#signupWarningMessageEmail.textContent = '';
    if (field === 'password')
      this.#signupWarningMessagePassword.textContent = '';
    if (field === 'code') this.#signupWarningMessageCode.textContent = '';

    if (field === 'code') classRemove(REMOVE, this.#signupWarningButton);
    else if (
      this.#signupWarningMessageUsername.textContent === '' &&
      this.#signupWarningMessageEmail.textContent === '' &&
      this.#signupWarningMessagePassword.textContent === ''
    )
      classRemove(REMOVE, this.#signupWarningButton);
  };

  signupButtonDisplay = this.#mainButtonDisplayFactory(this.#signupButton);

  signupPasswordTypeDisplay = passwordTypeDisplayFactory(
    this.#signupPasswordInput,
    this.#signupPasswordTypeButton
  );

  signupActionDisplay = ({ state, errorMessage }) => {
    const inputs = [
      this.#signupUsernameInput,
      this.#signupEmailInput,
      this.#signupPasswordInput,
      this.#signupCodeInput,
    ];

    if (state === LOADING) {
      inputs.forEach(input => {
        input.disabled = true;
        input.style.cssText = disabledCssText;
      });

      this.#signupBackButton.style.cursor = 'not-allowed';
      this.#mainButtonLoadingDisplay(true, this.#signupButton);
      return (this.#signupButton.style.cssText = disabledCssText);
    }

    inputs.forEach(input => {
      input.disabled = false;
      input.style.cssText = `opacity: 1; cursor: text;`;
    });
    this.#signupBackButton.style.cursor = 'pointer';
    this.#mainButtonLoadingDisplay(false, this.#signupButton);

    if (state === ERROR) {
      classRemove(ADD, this.#signupWarningButton);
      classRemove(REMOVE, this.#signupWarningMessageFail);
      this.#signupWarningMessageFail.textContent = errorMessage;
      this.#signupButton.style.cssText = `opacity: 1; cursor: pointer;`;
    }

    if (state === CONTENT) {
      resetPasswordInput(
        this.#signupPasswordInput,
        this.#signupPasswordTypeButton
      );
      inputs.forEach(input => (input.value = ''));
      classRemove(REMOVE, this.#signupWarningButton);
      classRemove(ADD, this.#signupWarningMessageFail);
      this.#signupWarningMessageUsername.textContent = '';
      this.#signupWarningMessageEmail.textContent = '';
      this.#signupWarningMessagePassword.textContent = '';
      this.#signupWarningMessageCode.textContent = '';
    }
  };

  signupInfoSuccess = (option = {}) => {
    const { goBack } = option;
    this.#signupHeaderTitle.textContent = goBack ? 'Sign Up' : 'Code';

    classRemove(
      goBack ? REMOVE : ADD,
      this.#signupUsernameInput.parentElement,
      this.#signupEmailInput.parentElement,
      this.#signupPasswordInput.parentElement,
      this.#signupSigninButton
    );

    classRemove(
      goBack ? ADD : REMOVE,
      this.#signupCodeInput.parentElement,
      this.#signupBackButton
    );

    if (goBack) {
      this.#signupCodeInput.value = '';
      classRemove(REMOVE, this.#signupWarningButton);
      classRemove(ADD, this.#signupWarningMessageFail);
      this.#signupWarningMessageCode.textContent = '';
      this.#signupButton.style.cssText = disabledCssText;
    }
  };

  // Sign-in - Events listening //////////

  addLoginCheckFirst(handler) {
    document.addEventListener('DOMContentLoaded', handler);
  }

  addLoginOpenHandler(handler) {
    [this.#loginOpenButtonSubHeader, this.#loginOpenButtonMainHeader].forEach(
      button => button.addEventListener('click', handler)
    );
  }

  addLoginCloseHandler(handler) {
    [
      this.#loginExitButton,
      this.#loginSection,
      this.#loginActivateButton,
      this.#loginForgotNameButton,
      this.#loginForgotPasswordButton,
      this.#loginSignupButton,
    ].forEach(element =>
      element.addEventListener('click', event => {
        event.preventDefault();
        handler();
      })
    );

    this.#loginForm.addEventListener('click', event => event.stopPropagation());
  }

  addLoginWarningHanler(handler) {
    this.#loginWarningButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addLoginInputHandlers(handlers) {
    // handlers -> [[], []]
    ['input', 'blur'].forEach((eventName, eventIndex) =>
      [this.#loginUsernameInput, this.#loginPasswordInput].forEach(
        (input, index) =>
          input.addEventListener(eventName, event =>
            handlers[eventIndex][index](event.target.value)
          )
      )
    );
  }

  addLoginPasswordTypeHandler(handler) {
    this.#loginPasswordTypeButton.addEventListener('click', handler);
  }

  addLoginHandler(handler) {
    this.#loginButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addLoginSocialHandler(handler) {
    this.#loginButtonSocialWrapper.addEventListener('click', event => {
      const target = event.target.closest('.login-form__options-button');
      if (target) {
        event.preventDefault();
        handler(target.dataset.loginSocial);
      }
    });
  }

  addLoginChooseActivateHandler(handler) {
    this.#loginActivateButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addLoginChooseForgotNameHandler(handler) {
    this.#loginForgotNameButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addLoginChooseForgotPasswordHandler(handler) {
    this.#loginForgotPasswordButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addLoginChooseSignupHandler(handler) {
    this.#loginSignupButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  // Sign-out - Events listening //////////

  addLogoutHandler(handler) {
    this.#logoutButtonSubHeader.addEventListener('click', handler);
  }

  // Activate - Events listening //////////

  addActivateCloseHandler(handler) {
    [this.#activateExitButton, this.#activateSection].forEach(element =>
      element.addEventListener('click', event => {
        event.preventDefault();
        handler();
      })
    );
    this.#activateForm.addEventListener('click', event =>
      event.stopPropagation()
    );
  }

  addActivateWarningHanler(handler) {
    this.#activateWarningButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addActivateInputHandlers(handlers) {
    ['input', 'blur'].forEach((eventName, eventIndex) =>
      [this.#activateEmailInput, this.#activateCodeInput].forEach(
        (input, index) =>
          input.addEventListener(eventName, event =>
            handlers[eventIndex][index](event.target.value)
          )
      )
    );
  }

  addActivateHandler(handler) {
    this.#activateButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addActivateActionsBackHandler(handler) {
    this.#activateActionsBackButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  // Forgot name - Events listening //////////

  addForgotNameCloseHandler(handler) {
    [this.#forgotNameExitButton, this.#forgotNameSection].forEach(element =>
      element.addEventListener('click', event => {
        event.preventDefault();
        handler();
      })
    );
    this.#forgotNameForm.addEventListener('click', event =>
      event.stopPropagation()
    );
  }

  addForgotNameWarningHandler(handler) {
    this.#forgotNameWarningButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addForgotNameInputEmailHandler(handlers) {
    ['input', 'blur'].forEach((eventName, index) =>
      this.#forgotNameEmailInput.addEventListener(eventName, event =>
        handlers[index](event.target.value)
      )
    );
  }

  addForgotNameHandler(handler) {
    this.#forgotNameButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  // Forgot password - Events listening //////////

  addForgotPasswordCloseHandler(handler) {
    [this.#forgotPasswordExitButton, this.#forgotPasswordSection].forEach(
      element =>
        element.addEventListener('click', event => {
          event.preventDefault();
          handler();
        })
    );
    this.#forgotPasswordForm.addEventListener('click', event =>
      event.stopPropagation()
    );
  }

  addForgotPasswordWarningHandler(handler) {
    this.#forgotPasswordWarningButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addForgotPasswordInputEmailHandler(handlers) {
    ['input', 'blur'].forEach((eventName, index) =>
      this.#forgotPasswordEmailInput.addEventListener(eventName, event =>
        handlers[index](event.target.value)
      )
    );
  }

  addForgotPasswordResetHandlers(handlers) {
    ['input', 'blur'].forEach((eventName, eventIndex) =>
      [
        this.#forgotPasswordCodeInput,
        this.#forgotPasswordNewPasswordInput,
      ].forEach((input, index) =>
        input.addEventListener(eventName, event =>
          handlers[eventIndex][index](event.target.value)
        )
      )
    );
  }

  addForgotPasswordNewPasswordTypeHandler(handler) {
    this.#forgotPasswordNewPasswordTypeButton.addEventListener(
      'click',
      handler
    );
  }

  addForgotPasswordHandler(handler) {
    this.#forgotPasswordButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addForgotPasswordBackHandler(handler) {
    this.#forgotPasswordActionsBackButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  // Sign-up - Events listening //////////

  addSignupCloseHandler(handler) {
    [this.#signupExitButton, this.#signupSection].forEach(element =>
      element.addEventListener('click', event => {
        event.preventDefault();
        handler();
      })
    );
    this.#signupForm.addEventListener('click', event =>
      event.stopPropagation()
    );
  }

  addSignupWarningHanler(handler) {
    this.#signupWarningButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addSignupInfoInputHandlers(handlers) {
    ['input', 'blur'].forEach((eventName, eventIndex) =>
      [
        this.#signupUsernameInput,
        this.#signupEmailInput,
        this.#signupPasswordInput,
      ].forEach((input, index) =>
        input.addEventListener(eventName, event =>
          handlers[eventIndex][index](event.target.value)
        )
      )
    );
  }

  addSignupCodeInputHandler(handlers) {
    ['input', 'blur'].forEach((eventName, eventIndex) =>
      this.#signupCodeInput.addEventListener(eventName, event =>
        handlers[eventIndex](event.target.value)
      )
    );
  }

  addSignupPasswordTypeHandler(handler) {
    this.#signupPasswordTypeButton.addEventListener('click', handler);
  }

  addSigupHandler(handler) {
    this.#signupButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addSignupBackHandler(handler) {
    this.#signupBackButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }
}

export default new AuthView();
