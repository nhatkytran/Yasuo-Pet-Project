import { REM, START, END, FADE_IN, FADE_OUT } from '../config';
import { $, animateFactory } from '../utils';

class ModalView {
  #modal = $('#modal');
  #animateModal;

  constructor() {
    this.#animateModal = animateFactory(this.#modal, {
      start: FADE_IN,
      end: FADE_OUT,
    });
  }

  open() {
    const scrollVertical = window.scrollY;

    document.body.classList.add('modal-open');
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollVertical / REM}rem;
    `;

    this.#animateModal(START);
    return scrollVertical;
  }

  close(scrollVertical) {
    this.#animateModal(END);
    document.body.removeAttribute('style');
    window.scrollTo({ top: scrollVertical });
    document.body.classList.remove('modal-open');
  }
}

export default new ModalView();
