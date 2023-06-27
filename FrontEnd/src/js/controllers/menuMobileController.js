import ModalContentController from './modalContentController';

class MenuMobileController extends ModalContentController {
  #menuMobileView;
  #universeMobileOpening;

  constructor(menuMobileView) {
    super();
    this.#menuMobileView = menuMobileView;
  }

  open = handleOpenModal =>
    super.open(handleOpenModal, this.#menuMobileView.open);

  close = handleCloseModal => {
    if (super.close(handleCloseModal, this.#menuMobileView.close)) {
      this.#universeMobileOpening = false;
      this.#menuMobileView.closeUniverseMobile();
    }
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
