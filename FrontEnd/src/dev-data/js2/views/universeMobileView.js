import { $ } from '../config.js';

class UniverseMobileView {
  _openButton = $('.mh-menu');
  _menu = $('.mh-table');
  _overlay = $('.mh-table__cover');
  _universe = $('.universe-mobile');
  _universeX = $('.mh-table__universe-x');
  _list = $('.universe-mobile__more');
  _universeClose = $('.mh-table__header-close');

  openMenu() {
    this._overlay.classList.remove('hide');
    this._menu.classList.add('show');
  }

  addHandlerOpenMenu(handler) {
    this._openButton.addEventListener('click', function () {
      handler('open');
    });
  }

  handleUniverse() {
    this._list.classList.toggle('show');
    this._universeX.classList.toggle('universe-x');
  }

  addHandlerUniverse(handler) {
    this._universe.addEventListener('click', function (event) {
      event.preventDefault();

      handler();
    });
  }

  closeMenu() {
    this._menu.classList.remove('show');
    this._overlay.classList.add('hide');
    this._list.classList.remove('show');
    this._universeX.classList.remove('universe-x');
  }

  addHandlerCloseMenu(handler) {
    this._universeClose.addEventListener('click', function () {
      handler('close');
    });

    this._overlay.addEventListener('click', function (event) {
      if (event.target.closest('.mh-table')) return;

      handler('close');
    });
  }
}

export default new UniverseMobileView();
