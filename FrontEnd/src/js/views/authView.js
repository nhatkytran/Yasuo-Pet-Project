import {
  ADD,
  REMOVE,
  CONTENT,
  LOADING,
  ERROR,
  START,
  END,
  FADE_IN,
} from '../config';

import { $, $$_, animateFactory, classRemove } from '../utils';

const warningMessageClass = '.login-form__header-warning-message';
const disabledCssText = `opacity: 0.6; cursor: not-allowed;`;

class AuthView {
  #loginSection = $('.login-overlay');
  #loginForm = $('#login-form');

  #loginOpenButtonSubHeader = $('.sub-header__content-login');
  #loginOpenButtonMainHeader = $('.main-header__play-sign-in');

  #loginUserName = $('.user__info-name');

  #loginExitButton = $('.login-form__header-hero-close');
  #loginWarningButton = $('.login-form__header-warning-button');

  #loginWarningMessageUsername = $(`${warningMessageClass}-username`);
  #loginWarningMessagePassword = $(`${warningMessageClass}-password`);
  #loginWarningMessageFail = $(`${warningMessageClass}-fail`);

  #loginUsernameInput = $('#login-form-username');
  #loginPasswordInput = $('#login-form-password');
  #loginPasswordTypeButton = $('.login-form-password__type-button');

  #loginButton = $('.login-form__body-button');
  #loginButtonSocialWrapper = $('.login-form__options');

  //

  #logoutButtonSubHeader = $('.sub-header__content-logout');

  //

  #animateLoginSection;

  constructor() {
    this.#animateLoginSection = animateFactory(this.#loginSection, {
      start: FADE_IN,
      end: 'fade-out-480',
    });
  }

  loginOpen = () => {
    classRemove(REMOVE, this.#loginSection);
    this.#animateLoginSection(START);
  };

  loginClose = () => {
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

  loginButtonDisplay = ({ canLogin }) => {
    if (!canLogin) this.#loginButton.style.cssText = disabledCssText;
    else this.#loginButton.style.cssText = `opacity: 1; cursor: pointer;`;
  };

  loginPasswordTypeDisplay = () => {
    $$_(this.#loginPasswordTypeButton, 'svg').forEach((svg, index) => {
      svg.classList.toggle('remove');
      if (!svg.classList.contains('remove'))
        this.#loginPasswordInput.setAttribute(
          'type',
          index === 0 ? 'password' : 'text'
        );
    });
  };

  loginActionDisplay = ({ state, errorMessage }) => {
    if (state === LOADING) {
      this.#loginUsernameInput.disabled = true;
      this.#loginPasswordInput.disabled = true;
      this.#loginUsernameInput.style.cssText = disabledCssText;
      this.#loginPasswordInput.style.cssText = disabledCssText;

      $$_(this.#loginButton, 'svg').forEach((svg, index) =>
        classRemove(index === 0 ? ADD : REMOVE, svg)
      );
      return (this.#loginButton.style.cssText = disabledCssText);
    }

    this.#loginUsernameInput.disabled = false;
    this.#loginPasswordInput.disabled = false;
    this.#loginUsernameInput.style.cssText = `opacity: 1; cursor: text;`;
    this.#loginPasswordInput.style.cssText = `opacity: 1; cursor: text;`;

    $$_(this.#loginButton, 'svg').forEach((svg, index) =>
      classRemove(index === 1 ? ADD : REMOVE, svg)
    );

    if (state === ERROR) {
      classRemove(ADD, this.#loginWarningButton);
      this.#loginWarningMessageFail.textContent = errorMessage;
      classRemove(REMOVE, this.#loginWarningMessageFail);
      this.#loginButton.style.cssText = `opacity: 1; cursor: pointer;`;
    }

    if (state === CONTENT) {
      this.#loginUsernameInput.value = '';
      this.#loginPasswordInput.value = '';
    }
  };

  loginSuccessDisplay = () => {};

  //

  logoutActionDisplay = state => {
    if (state === LOADING) {
      document.documentElement.style.cursor = 'wait';
      document.body.style.cssText = `
        pointer-events: none;
        filter: brightness(0.4);
        opacity: 0.8;
      `;
    }
    if (state === CONTENT || state === ERROR) {
      document.documentElement.style.cursor = 'default';
      document.body.style.cssText = `
        pointer-events: unset;
        filter: unset;
        opacity: unset;
      `;
    }
  };

  logoutSuccess = () => {
    classRemove(
      REMOVE,
      this.#loginOpenButtonSubHeader,
      this.#loginOpenButtonMainHeader
    );
    classRemove(ADD, this.#loginUserName, this.#logoutButtonSubHeader);
  };

  //
  // Events listening //////////

  addLoginOpenHandler(handler) {
    [this.#loginOpenButtonSubHeader, this.#loginOpenButtonMainHeader].forEach(
      button => button.addEventListener('click', handler)
    );
  }

  addLoginCloseHandler(handler) {
    [this.#loginExitButton, this.#loginSection].forEach(element =>
      element.addEventListener('click', handler)
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
    this.#loginPasswordTypeButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
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

  addLogoutHandler(handler) {
    this.#logoutButtonSubHeader.addEventListener('click', handler);
  }
}

export default new AuthView();
