import { ADD, REMOVE } from '../config';
import { $ } from '../utils';

class MenuMobileView {
  #modal = $('#modal');
  #mainButton = $('.mh-menu__btn');

  #menu = $('.mh-menu');
  #menuCloseButton = $('.mh-menu__header-close');

  #universeMobile = $('.universe-mobile');
  #universeMobileMore = $('.universe-mobile__more');
  #universeX = $('.mh-menu__universe-x');

  #closeHandler; // addCloseMenuHandler
  #windowResizeClose = () => {
    // #closeHandler set by addCloseMenuHandler
    if (window.innerWidth >= 1140) this.#closeHandler();
  };

  open = () => {
    this.#menu.classList.add('slide-to-origin');
    window.addEventListener('resize', this.#windowResizeClose);
  };

  close = () => {
    this.#menu.classList.remove('slide-to-origin');
    window.removeEventListener('resize', this.#windowResizeClose);
  };

  #universeMobileAnimate = (action, transform) => {
    this.#universeMobileMore.classList[action]('show');
    this.#universeX.style.transform = transform;
  };

  openUniverseMobile() {
    this.#universeMobileAnimate(ADD, 'rotate(-45deg)');
  }

  closeUniverseMobile() {
    this.#universeMobileAnimate(REMOVE, 'unset');
  }

  //
  // Events listening //////////

  addOpenMenuHandler(handler) {
    this.#mainButton.addEventListener('click', handler);
  }

  addCloseMenuHandler(handler) {
    this.#closeHandler = handler;
    this.#menuCloseButton.addEventListener('click', handler);
    this.#modal.addEventListener('click', handler);
  }

  addToggleUniverseMobile(handler) {
    this.#universeMobile.addEventListener('click', handler);
  }
}

export default new MenuMobileView();
