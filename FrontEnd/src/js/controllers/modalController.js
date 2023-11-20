import { ANIMATION_TIMEOUT } from '../config';

class ModalController {
  #modalView;
  #modalIsOpening;
  #modalIsClosing;
  #scrollVertical;

  constructor(modalView) {
    this.#modalView = modalView;
  }

  open = () => {
    if (this.#modalIsOpening || this.#modalIsClosing) return;

    this.#modalIsOpening = true;
    this.#scrollVertical = this.#modalView.open();

    setTimeout(() => {
      this.#modalIsOpening = false;
    }, ANIMATION_TIMEOUT);

    return this.#scrollVertical;
  };

  close = () => {
    if (this.#modalIsOpening || this.#modalIsClosing) return;
    this.#modalIsClosing = true;

    // Delay with timeout to wait for sidebar's closing
    setTimeout(() => {
      this.#modalIsClosing = false;
      this.#modalView.close(this.#scrollVertical);
    }, ANIMATION_TIMEOUT);
  };
}

export default ModalController;
