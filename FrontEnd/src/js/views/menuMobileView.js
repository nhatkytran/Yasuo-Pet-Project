import { ADD, REMOVE } from '../config';
import { $ } from '../utils';

class MenuMobileView {
  #modal;
  #mainButton;

  #menu;
  #menuCloseButton;

  #universeMobile;
  #universeMobileMore;
  #universeX;

  #menuAnimationClass;

  constructor() {
    this.#modal = $('#modal');
    this.#mainButton = $('.mh-menu__btn');

    this.#menu = $('.mh-menu');
    this.#menuCloseButton = $('.mh-menu__header-close');

    this.#universeMobile = $('.universe-mobile');
    this.#universeMobileMore = $('.universe-mobile__more');
    this.#universeX = $('.mh-menu__universe-x');

    this.#menuAnimationClass = 'slide-to-origin';
  }

  #closeHandler;
  #windowResizeClose = () => {
    // #closeHandler set by addCloseMenuHandler
    if (window.innerWidth >= 1140) this.#closeHandler();
  };

  open() {
    this.#menu.classList.add(this.#menuAnimationClass);
    window.addEventListener('resize', this.#windowResizeClose);
  }

  close() {
    this.#menu.classList.remove(this.#menuAnimationClass);
    window.removeEventListener('resize', this.#windowResizeClose);
  }

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
