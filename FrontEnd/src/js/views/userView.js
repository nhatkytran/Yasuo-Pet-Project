import {
  BACKEND_URL,
  ANIMATION_TIMEOUT,
  START,
  END,
  ADD,
  REMOVE,
  CONTENT,
  LOADING,
  ERROR,
  LOGIN_SUCCESS_SIGNAL,
  LOGOUT_SUCCESS_SIGNAL,
} from '../config';

import {
  $,
  $_,
  $$,
  animateFactory,
  classRemove,
  passwordTypeDisplayFactory,
  resetPasswordInput,
} from '../utils';

const enabledCssEffect = `opacity: 1; cursor: pointer;`;
const disabledCssEffect = `opacity: 0.6; cursor: not-allowed;`;

class UserView {
  // General //////////

  #username = $('.user__info-name');
  #userAvatarWrapper = $('.yasuo-round');

  #profileButtonBack = $('.profile-header__back');
  #profileSidebarList = $_($('.profile-sidebar'), 'ul');

  #profile = $('.profile');
  #profileRiotID = $('#profile-riot-id');
  #profileEmail = $('#profile-email');
  #profileAvatarContainer = $('.profile-pi__img-container');
  #profileUsername = $('#profile-username');
  #profileFileAvatar = $('#profile-file-avatar');

  #animateProfile = animateFactory(this.#profile, {
    start: 'fade-in-500',
    end: 'fade-out-480',
  });

  // Riot Account Sign-in //////////

  #accountSigninCurrentPasswordInput = $(
    '#riot-account-signin-current-password'
  );
  #accountSigninNewPasswordInput = $('#riot-account-signin-new-password');

  #accountSigninPasswordMessageGeneral = $(
    '.riot-account-signin-password-message-general'
  );
  #accountSigninPasswordMessageGeneralParagraph = $_(
    this.#accountSigninPasswordMessageGeneral,
    'p'
  );
  #accountSigninPasswordMessageCurrentPassword = $(
    '.riot-account-signin-password-message-current-password'
  );
  #accountSigninPasswordMessageNewPassword = $(
    '.riot-account-signin-password-message-new-password'
  );

  #accountSigninButtonSubmit = $('#riot-account-signin-button-submit');
  #accountSigninButtonCancel = $('#riot-account-signin-button-cancel');
  #accountSigninButtonCurrentPasswordType = $(
    '#riot-account-signin-current-password-type-button'
  );
  #accountSigninButtonNewPasswordType = $(
    '#riot-account-signin-new-password-type-button'
  );

  // General - Events listening //////////

  changeLook = (username, photoLink) => {
    // Change username
    let nameUI = username;
    const socials = ['google', 'facebook', 'github', 'apple'];

    nameUI = username.split('.');
    if (socials.includes(nameUI.at(-1))) nameUI = nameUI.slice(0, -1);

    nameUI = nameUI.join('.').replaceAll(' ', '');
    if (nameUI.length > 10) nameUI = nameUI.slice(0, 10) + '...';

    this.#username.textContent = nameUI;

    // Change avatar
    const image = document.createElement('img');
    image.src = photoLink.startsWith('http')
      ? photoLink
      : `${BACKEND_URL}${photoLink}`;

    image.addEventListener('load', () => {
      this.#userAvatarWrapper.innerHTML = '';
      this.#userAvatarWrapper.appendChild(image);
    });
  };

  #handleContent = userData => {
    const { id, username, email, photo } = userData;

    this.#profileRiotID.setAttribute('value', id);
    this.#profileEmail.setAttribute('value', email);
    this.#profileUsername.setAttribute('value', username);

    let photoLink = `${BACKEND_URL}${photo}`;

    if (photo.startsWith('http')) {
      photoLink = photo;
      this.#profileFileAvatar.disabled = true;
    }

    const image = document.createElement('img');
    image.src = photoLink;

    image.addEventListener('load', () => {
      this.#profileAvatarContainer.innerHTML = '';
      this.#profileAvatarContainer.appendChild(image);
    });
  };

  scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

  openProfile = userData => {
    classRemove(REMOVE, this.#profile);
    this.#handleContent(userData);
    this.#animateProfile(START);
  };

  closeProfile = () => {
    this.#animateProfile(END);
    setTimeout(
      classRemove.bind(null, ADD, this.#profile),
      ANIMATION_TIMEOUT * 2
    );
  };

  //

  addDataHandler(handler) {
    // First loading of the page and after login will trigger
    this.#username.addEventListener(LOGIN_SUCCESS_SIGNAL, event =>
      handler(event.detail)
    );
    this.#username.addEventListener(LOGOUT_SUCCESS_SIGNAL, event =>
      handler(event.detail)
    );
  }

  addOpenProfileHandler(handler) {
    this.#username.addEventListener('click', handler);
  }

  addCloseProfileHandler(handler) {
    this.#profileButtonBack.addEventListener('click', handler);
  }

  addSidebarHandler(handler) {
    this.#profileSidebarList.addEventListener('click', event => {
      const target = event.target.closest('.profile-sidebar-button');
      if (!target) return;

      event.preventDefault();
      $$('.profile-sidebar-button').forEach(button =>
        button.classList.remove('active')
      );

      target.classList.add('active');
      handler(target.dataset.block);
    });
  }

  // Riot Account Sign-in - Events listening //////////

  accountSigninWarningMessage = ({ isError, field, allFieldsValid }) => {
    let input;
    let message;

    this.#accountSigninPasswordMessageGeneralParagraph.textContent = '';
    classRemove(ADD, this.#accountSigninPasswordMessageGeneral);

    if (field === 'current_password') {
      input = this.#accountSigninCurrentPasswordInput;
      message = this.#accountSigninPasswordMessageCurrentPassword;
    }
    if (field === 'new_password') {
      input = this.#accountSigninNewPasswordInput;
      message = this.#accountSigninPasswordMessageNewPassword;
    }

    input.parentElement.classList[isError ? ADD : REMOVE]('invalid');
    classRemove(isError ? REMOVE : ADD, message);
  };

  accountSigninButtonDisplay = ({ hasData, canSubmit }) => {
    // Has data in atleast one field, currentPassword || newPassword
    if (hasData) {
      this.#accountSigninButtonSubmit.classList[canSubmit ? ADD : REMOVE](
        'active'
      );
      classRemove(REMOVE, this.#accountSigninButtonCancel);
    } else {
      this.#accountSigninButtonSubmit.classList.remove('active');
      classRemove(ADD, this.#accountSigninButtonCancel);
    }
  };

  accountSigninCurrentPasswordTypeDisplay = passwordTypeDisplayFactory(
    this.#accountSigninCurrentPasswordInput,
    this.#accountSigninButtonCurrentPasswordType
  );

  accountSigninNewPasswordTypeDisplay = passwordTypeDisplayFactory(
    this.#accountSigninNewPasswordInput,
    this.#accountSigninButtonNewPasswordType
  );

  accountSigninActionDisplay = ({ state, errorMessage }) => {
    const inputs = [
      this.#accountSigninCurrentPasswordInput,
      this.#accountSigninNewPasswordInput,
    ];
    const buttons = [
      this.#accountSigninButtonCancel,
      this.#accountSigninButtonSubmit,
    ];

    const cssText = state === LOADING ? disabledCssEffect : enabledCssEffect;
    inputs.forEach(input => {
      input.disabled = state === LOADING;
      input.style.cssText = cssText;
    });
    buttons.forEach(button => (button.style.cssText = cssText));

    if (state === LOADING) return;

    if (state === ERROR) {
      this.#accountSigninPasswordMessageGeneralParagraph.textContent =
        errorMessage;
      classRemove(REMOVE, this.#accountSigninPasswordMessageGeneral);
    }

    if (state === CONTENT) {
      [
        this.#accountSigninButtonCurrentPasswordType,
        this.#accountSigninButtonNewPasswordType,
      ].forEach((typeButton, index) =>
        resetPasswordInput(inputs[index], typeButton)
      );
      inputs.forEach(input => (input.value = ''));
      this.#accountSigninButtonSubmit.classList.remove('active');
      this.#accountSigninPasswordMessageGeneralParagraph.textContent = '';
      classRemove(
        ADD,
        this.#accountSigninPasswordMessageGeneral,
        this.#accountSigninButtonCancel
      );
    }
  };

  accountSigninSubmitCancel = () => {
    const inputs = [
      this.#accountSigninCurrentPasswordInput,
      this.#accountSigninNewPasswordInput,
    ];
    const typeButtons = [
      this.#accountSigninButtonCurrentPasswordType,
      this.#accountSigninButtonNewPasswordType,
    ];
    const messages = [
      this.#accountSigninPasswordMessageCurrentPassword,
      this.#accountSigninPasswordMessageNewPassword,
    ];

    inputs.forEach((input, index) => {
      input.value = '';
      input.disabled = false;
      input.parentElement.classList.remove('invalid');
      resetPasswordInput(input, typeButtons[index]);
      classRemove(ADD, messages[index]);
    });

    this.#accountSigninButtonSubmit.classList.remove('active');
    this.#accountSigninPasswordMessageGeneralParagraph.textContent = '';
    classRemove(
      ADD,
      this.#accountSigninPasswordMessageGeneral,
      this.#accountSigninButtonCancel
    );
  };

  //

  addAccountSigninInputHandlers(handlers) {
    ['input', 'blur'].forEach((eventName, eventIndex) =>
      [
        this.#accountSigninCurrentPasswordInput,
        this.#accountSigninNewPasswordInput,
      ].forEach((input, index) =>
        input.addEventListener(eventName, event =>
          handlers[eventIndex][index](event.target.value)
        )
      )
    );
  }

  addAccountSigninPasswordTypeHandlers(handlers) {
    [
      this.#accountSigninButtonCurrentPasswordType,
      this.#accountSigninButtonNewPasswordType,
    ].forEach((button, index) =>
      button.addEventListener('click', handlers[index])
    );
  }

  addAccountSigninSubmitHandler(handler) {
    this.#accountSigninButtonSubmit.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }

  addAcountSigninSubmitCancelHandler(handler) {
    this.#accountSigninButtonCancel.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }
}

export default new UserView();
