import ModalContentController from './modalContentController';

class MenuMobileController extends ModalContentController {
  #menuMobileView;
  #universeMobileOpening;
  #handleOpenModal;
  #handleCloseModal;

  constructor(menuMobileView, handleOpenModal, handleCloseModal) {
    super();
    this.#menuMobileView = menuMobileView;
    this.#handleOpenModal = handleOpenModal;
    this.#handleCloseModal = handleCloseModal;
  }

  open = () => super.open(this.#handleOpenModal, this.#menuMobileView.open);

  close = () => {
    if (super.close(this.#handleCloseModal, this.#menuMobileView.close)) {
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
