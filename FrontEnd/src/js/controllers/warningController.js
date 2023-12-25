import { ANIMATION_TIMEOUT } from '../config';

class WarningController {
  #WarningView;
  #handleOpenModal;
  #handleCloseModal;

  constructor(WarningView, handleOpenModal, handleCloseModal) {
    this.#WarningView = WarningView;
    this.#handleOpenModal = handleOpenModal;
    this.#handleCloseModal = handleCloseModal;
  }

  open = options => {
    const { title, description, acceptMessage } = options;
    this.#WarningView.changeMessages({ title, description, acceptMessage });
    this.#WarningView.open();
    this.#handleOpenModal();
  };

  close = () => {
    this.#WarningView.close();
    this.#handleCloseModal();
  };

  registerEvents = (aborts, handlers) =>
    this.#WarningView.registerEvents(aborts, handlers);

  framework = ({ open, accept }) => {
    let isOpening, isClosing;
    let acceptAbort, declineAbort, declineModalAbort;

    const aborts = () => {
      if (acceptAbort) acceptAbort.abort();
      if (declineAbort) declineAbort.abort();
      if (declineModalAbort) declineModalAbort.abort();
    };

    const acceptHandler = () => {
      if (isOpening || isClosing) return;
      isClosing = true;

      aborts();
      this.close();
      setTimeout(() => {
        isClosing = false;
        open(index);
      }, ANIMATION_TIMEOUT);
    };

    const closeHandler = () => {
      if (isOpening || isClosing) return;
      isClosing = true;

      aborts();
      this.close();
      setTimeout(() => (isClosing = false), ANIMATION_TIMEOUT);
    };

    return index => {
      if (isOpening || isClosing) return;
      isOpening = true;

      acceptAbort = new AbortController();
      declineAbort = new AbortController();
      declineModalAbort = new AbortController();

      this.registerEvents(
        [acceptAbort, declineAbort, declineModalAbort],
        [acceptHandler, closeHandler, closeHandler]
      );
      this.open(accept(index));

      setTimeout(() => (isOpening = false), ANIMATION_TIMEOUT);
    };
  };
}

export default WarningController;
