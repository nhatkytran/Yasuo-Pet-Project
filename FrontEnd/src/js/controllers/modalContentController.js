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

      this.#isOpening = true;
      handleOpenModal();
      openContent();

      const timeToOpen = ANIMATION_TIMEOUT;
      setTimeout(() => (this.#isOpening = false), timeToOpen);
      return timeToOpen;
    };
  }

  get close() {
    return (handleCloseModal, closeContent) => {
      if (this.#isOpening || this.#isClosing) return false;

      this.#isClosing = true;
      handleCloseModal();

      const timeToClose = ANIMATION_TIMEOUT;
      closeContent(timeToClose);
      setTimeout(() => (this.#isClosing = false), timeToClose);
    };
  }
}

export default ModalContentController;
