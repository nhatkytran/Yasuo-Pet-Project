import { ANIMATION_TIMEOUT } from '../config';

class MenuMobileController {
  #menuMobileView;

  #menuIsOpening;
  #menuIsClosing;

  #universeMobileOpening;

  constructor(menuMobileView) {
    this.#menuMobileView = menuMobileView;
  }

  open = handleOpenModal => {
    if (this.#menuIsOpening || this.#menuIsClosing) return;

    handleOpenModal();

    this.#menuIsOpening = true;
    this.#menuMobileView.open();

    setTimeout(() => {
      this.#menuIsOpening = false;
    }, ANIMATION_TIMEOUT);
  };

  close = handleCloseModal => {
    if (this.#menuIsOpening || this.#menuIsClosing) return;

    handleCloseModal();

    this.#menuIsClosing = true;
    this.#menuMobileView.close();

    // in case Universe Mobile is opening --> close
    this.#universeMobileOpening = false;
    this.#menuMobileView.closeUniverseMobile();

    setTimeout(() => {
      this.#menuIsClosing = false;
    }, ANIMATION_TIMEOUT);
  };

  toggle = event => {
    event.preventDefault();

    !this.#universeMobileOpening
      ? this.#menuMobileView.openUniverseMobile()
      : this.#menuMobileView.closeUniverseMobile();

    this.#universeMobileOpening = !this.#universeMobileOpening;
  };
}

export default MenuMobileController;
