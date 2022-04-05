import { $ } from '../config.js';
import '../useful/smoothScrollSafari.js';

class AutoScrollView {
  _parentElement = $('.main-header-about__list');
  _top = $('.container');
  _scrollToTop = $('.main-header__lol-symbol-link');
  _informationSection = $('#information');
  _abilitiesSection = $('#abilities');
  _skinsSection = $('#skins');
  _ruinedSection = $('#ruined');
  _gallerySection = $('#gallery');
  _all = [
    this._informationSection,
    this._abilitiesSection,
    this._skinsSection,
    this._ruinedSection,
    this._gallerySection,
  ];

  handleAutoScroll(id) {
    this._all[id].scrollIntoView({
      behavior: 'smooth',
    });
  }

  addHandlerAutoScroll(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const target = event.target.closest('.scroll-auto');

      if (target) {
        event.preventDefault();

        handler(Number.parseInt(target.dataset.id));
      }
    });
  }

  handleScrollToTop() {
    this._top.scrollIntoView({
      behavior: 'smooth',
    });
  }

  addHandlerScrollToTop(handler) {
    this._scrollToTop.addEventListener('click', function (event) {
      event.preventDefault();

      handler();
    });
  }
}

export default new AutoScrollView();
