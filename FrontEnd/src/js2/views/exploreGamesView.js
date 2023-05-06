import { $, $$ } from '../config.js';

class ExploreGamesView {
  _openButton = $('.main-header__games');
  _overlay = $('.explore-games-container');
  _exploreGames = $('.explore-games');
  _exploreGamesHeader = $('.explore-games__header');
  _exploreGamesPoster = $$('.explore-games__body-poster');
  _closeButton = $('.explore-games__header-more-close');

  handleOpen() {
    this._overlay.classList.add('show');
    this._exploreGames.classList.add('show');

    setTimeout(() => {
      // Class 'show' help create animation for '_exploreGames
      this._exploreGames.classList.remove('show');
      this._exploreGamesHeader.classList.add('show');
    }, 200);

    setTimeout(() => {
      this._exploreGamesPoster.forEach((poster, index) => {
        setTimeout(function () {
          poster.classList.add('show');
        }, (index + 1) * 100);
      });
    }, 400);
  }

  addHandlerOpen(handler) {
    this._openButton.addEventListener('click', function () {
      handler('open');
    });
  }

  handleClose() {
    this._exploreGames.classList.add('close-special');
    this._exploreGamesHeader.classList.remove('show');
    this._exploreGamesPoster.forEach(poster => {
      poster.classList.remove('show');
    });

    setTimeout(() => {
      this._exploreGames.classList.remove('close-special');
      this._overlay.classList.remove('show');
    }, 300);
  }

  addHandlerClose(handler) {
    this._closeButton.addEventListener('click', function () {
      handler('close');
    });

    this._overlay.addEventListener('click', function (event) {
      if (event.target.closest('.explore-games')) return;

      handler('close');
    });
  }
}

export default new ExploreGamesView();
