import { ANIMATION_TIMEOUT, NONE, LOADING, ERROR, CONTENT } from '../config';
import { checkAbortError } from '../utils';

class ModalContentController {
  #isOpening;
  #isClosing;

  // open | close
  // return true | false the Child Classes can handle another actions
  // For example: emit signal,...

  // Why getter?
  // Help Child Class access to method via `super`
  // For example: super.open()

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
      closeContent(ANIMATION_TIMEOUT); // Sidebar Arrow needs ANIMATION_TIMEOUT

      setTimeout(() => {
        this.#isClosing = false;
      }, ANIMATION_TIMEOUT);

      return true;
    };
  }
}

export default ModalContentController;
