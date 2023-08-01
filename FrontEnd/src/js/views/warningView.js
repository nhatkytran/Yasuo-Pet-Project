import { $ } from '../utils';

class WarningView {
  #warning;

  #title;
  #description;
  #buttonAccept;
  #buttonReject;

  constructor() {
    this.#warning = $('.warning');

    this.#title = $('.warning-header');
    this.#description = $('.warning-description');
    this.#buttonAccept = $('.warning-create');
    this.#buttonReject = $('.warning-close');
  }

  open() {
    this.#warning.classList.add('slide');
  }

  close() {
    this.#warning.classList.remove('slide');
  }

  changeMessages({ title, description, buttonMessage }) {
    this.#title.innerHTML = title;
    this.#description.innerHTML = description;
    this.#buttonAccept.innerHTML = buttonMessage;
  }

  addAcceptHandler(abortController, handler) {
    this.#buttonAccept.addEventListener('click', handler, {
      once: true,
      signal: abortController.signal,
    });
  }

  addDeclineHandler(abortController, handler) {
    this.#buttonReject.addEventListener('click', handler, {
      once: true,
      signal: abortController.signal,
    });
  }
}

export default new WarningView();
