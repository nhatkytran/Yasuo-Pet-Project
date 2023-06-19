import { START, END, FADE_IN, FADE_OUT } from '../config';
import { $, animateFactory } from '../utils';

class ModalView {
  #modal;
  #animateModal;

  constructor() {
    this.#modal = $('#modal');
    this.#animateModal = animateFactory(this.#modal, {
      start: FADE_IN,
      end: FADE_OUT,
    });
  }

  #stopScrollBody() {
    const scrollVertical = window.scrollY;

    document.body.style.cssText = `
      position: fixed;
      top: -${scrollVertical / 10}rem;
    `;

    return scrollVertical;
  }

  open() {
    document.body.classList.add('modal-open');
    this.#animateModal(START);

    return this.#stopScrollBody();
  }

  close(scrollVertical) {
    this.#animateModal(END);
    document.body.removeAttribute('style');
    window.scrollTo({ top: scrollVertical });
    document.body.classList.remove('modal-open');
  }

  addCloseModalHandler(handler) {
    this.#modal.addEventListener('click', handler);
  }
}

export default new ModalView();
