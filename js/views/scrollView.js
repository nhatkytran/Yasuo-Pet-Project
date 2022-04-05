import { $ } from '../config.js';

class ScrollView {
  // Information
  _informationObserved = $('.information');
  _informationUnForfiven = $('.information-yasuo__name-unforgiven');
  _informationYasuo = $('.information-yasuo__name-yasuo');

  // Abilities
  _abilitiesObserved = $('.abilities');
  _abilitiesTitle = $('.abilities__content-header');
  _abilitiesQuote = $('.abilities__content-footer-quote');

  constructor() {
    // const observer = new IntersectionObserver();
  }

  // General //
  _observerFunction(handler, observed, callback, threshold) {
    new IntersectionObserver(callback.bind(null, handler), {
      root: null,
      threshold: threshold,
    }).observe(observed);
  }

  // Information
  handleInformationScroll(action) {
    this._informationUnForfiven.classList[action]('scroll');

    setTimeout(() => {
      this._informationYasuo.classList[action]('scroll');
    }, 400);
  }

  _informationCallback(handler, entries, _) {
    handler(entries[0].isIntersecting);
  }

  addHandlerInformationScroll(handler) {
    this._observerFunction(
      handler,
      this._informationObserved,
      this._informationCallback,
      0.4
    );
  }

  // Abilities
  handleAbilitiesScroll(action) {
    this._abilitiesTitle.classList[action]('scroll');
    this._abilitiesQuote.classList[action]('scroll');
  }

  _abilitiesCallback(handler, entries, _) {
    handler(entries[0].isIntersecting);
  }

  addHandlerAbilitiesScroll(handler) {
    this._observerFunction(
      handler,
      this._abilitiesObserved,
      this._abilitiesCallback,
      0.1
    );
  }
}

export default new ScrollView();
