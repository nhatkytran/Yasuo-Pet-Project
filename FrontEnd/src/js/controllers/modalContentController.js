import { ANIMATION_TIMEOUT } from '../config';

class ModalContentController {
  #isOpening;
  #isClosing;

  // open | close
  // return true | false the Child Classes can handle another actions
  // For example: emit signal,...

  get open() {
    return (handleOpenModal, openContent) => {
      if (this.#isOpening || this.#isClosing) return false;

      handleOpenModal();

      this.#isOpening = true;
      openContent();

      setTimeout(() => {
        this.#isOpening = false;
      }, ANIMATION_TIMEOUT);

      return true;
    };
  }

  get close() {
    return (handleCloseModal, closeContent) => {
      if (this.#isOpening || this.#isClosing) return false;

      handleCloseModal();

      this.#isClosing = true;
      closeContent();

      setTimeout(() => {
        this.#isClosing = false;
      }, ANIMATION_TIMEOUT);

      return true;
    };
  }
}

export default ModalContentController;
