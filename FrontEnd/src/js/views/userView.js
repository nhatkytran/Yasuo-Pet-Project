import { BACKEND_URL, LOGIN_SUCCESS_SIGNAL } from '../config';
import { $, $_ } from '../utils';

class UserView {
  #username = $('.user__info-name');
  #userAvatarWrapper = $('.yasuo-round');

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
    image.src = `${BACKEND_URL}${photoLink}`;

    image.addEventListener('load', () => {
      this.#userAvatarWrapper.innerHTML = '';
      this.#userAvatarWrapper.appendChild(image);
    });
  };

  //
  // Events listening //////////

  addDataHandler(handler) {
    // First loading of the page and after login will trigger
    this.#username.addEventListener(LOGIN_SUCCESS_SIGNAL, handler);
  }

  addOpenProfileHandler(handler) {
    this.#username.addEventListener('click', handler);
  }
}

export default new UserView();
