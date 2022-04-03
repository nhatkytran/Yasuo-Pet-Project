import { $, $$ } from '../config.js';

class UniverseView {
  _parentElement = $('.find-more');
  _universe = $('.universe .list-1__link');
  _universeX = $('.universe-x');
  _list = $('.list-2');
  _listItems = $$('.list-2__item');

  constructor() {
    this._parentElement
      .querySelector('.main-header-about__link')
      .addEventListener('click', function (event) {
        event.preventDefault();
      });
  }

  toggleUniverse() {
    this._universeX.classList.toggle('universe-icon');
    this._list.classList.toggle('open');

    for (let item of this._listItems) {
      item.classList.toggle('open');
    }
  }

  addHandlerUniverse(handler) {
    this._universe.addEventListener('click', function (event) {
      event.preventDefault();

      handler();
    });
  }

  closeUniverseSurprise() {
    this._universeX.classList.remove('universe-icon');
    this._list.classList.remove('open');

    for (let item of this._listItems) {
      item.classList.remove('open');
    }
  }

  addHandlerUniverseCloseSurprise(handler) {
    this._parentElement.addEventListener('mouseleave', handler);
  }
}

export default new UniverseView();
