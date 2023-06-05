import { ADD, REMOVE } from '../config';
import { $ } from '../helpers';

class ModalView {
  #modal;

  constructor() {
    this.#modal = $('#modal');
  }

  #animateModal(state) {
    if (state === ADD) this.#modal.classList.add('fade-in');
    if (state === REMOVE) this.#modal.classList.remove('fade-in');
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
    this.#animateModal(ADD);

    return this.#stopScrollBody();
  }

  close(scrollVertical) {
    this.#animateModal(REMOVE);
    document.body.removeAttribute('style');
    window.scrollTo({ top: scrollVertical });
    document.body.classList.remove('modal-open');
  }

  addCloseModalHandler(handler) {
    this.#modal.addEventListener('click', handler);
  }
}

export default new ModalView();
