import { ANIMATION_TIMEOUT } from '../config';

class ModalContentController {
  #isOpening;
  #isClosing;

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
    };
  }
}

export default ModalContentController;
