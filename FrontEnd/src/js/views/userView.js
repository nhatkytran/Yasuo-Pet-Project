import {
  BACKEND_URL,
  ANIMATION_TIMEOUT,
  START,
  END,
  ADD,
  REMOVE,
  LOGIN_SUCCESS_SIGNAL,
  LOGOUT_SUCCESS_SIGNAL,
} from '../config';

import { $, $_, $$, animateFactory, classRemove } from '../utils';

class UserView {
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

  #animateProfile;

  constructor() {
    this.#animateProfile = animateFactory(this.#profile, {
      start: 'fade-in-500',
      end: 'fade-out-480',
    });
  }

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
  // Events listening //////////

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
}

export default new UserView();
