import { $ } from '../utils';

class WarningView {
  #modal = $('#modal');
  #warning = $('.warning');
  #title = $('.warning-header');
  #description = $('.warning-description');
  #buttonAccept = $('.warning-create');
  #buttonDecline = $('.warning-close');

  open = () => this.#warning.classList.add('slide');
  close = () => this.#warning.classList.remove('slide');

  changeMessages = ({ title, description, acceptMessage }) => {
    this.#title.innerHTML = title || 'Attention League of Legends Players';
    this.#description.innerHTML = description || '';
    this.#buttonAccept.innerHTML = acceptMessage || 'Accept';
  };

  registerEvents(aborts, handlers) {
    [this.#buttonAccept, this.#buttonDecline, this.#modal].forEach(
      (element, index) =>
        element.addEventListener('click', handlers[index], {
          signal: aborts[index].signal,
        })
    );
  }
}

export default new WarningView();
