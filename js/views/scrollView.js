import { $ } from '../config.js';

class ScrollView {
  // Information
  _informationObserved = $('.information');
  _informationUnForfiven = $('.information-yasuo__name-unforgiven');
  _informationYasuo = $('.information-yasuo__name-yasuo');

  // Abilities
  _abilitiesObserved = $('.abilities');
  _abilitiesTitle = $('.abilities__content-header');

  // Skins
  _skinsObserved = $('.skins');
  _skinsTitle = $('.skins_container__header-title');

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

  // Skins
  handleSkinsScroll(state) {
    this._skinsTitle.classList.add('scroll');

    setTimeout(() => {
      this._skinsTitle.classList.remove('scroll');
    }, 400);
  }

  _skinsCallback(handler, entries, _) {
    handler(entries[0].isIntersecting);
  }

  addHandlerSkinsScroll(handler) {
    this._observerFunction(
      handler,
      this._skinsObserved,
      this._skinsCallback,
      0.15
    );
  }
}

export default new ScrollView();
