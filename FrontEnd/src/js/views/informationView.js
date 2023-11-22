import { ANIMATION_TIMEOUT_500 } from '../config';
import { $, intersectOneTime, startAnimationObserveFactory } from '../utils';

class InformationView {
  #nameUnforgiven = $('.information-yasuo__name-unforgiven');
  #nameYasuo = $('.information-yasuo__name-yasuo');
  #characteristic = $('.information-yasuo__about-characteristic');
  #story = $('.information-yasuo__about-story');

  startAnimationObserve = startAnimationObserveFactory(
    [this.#nameUnforgiven, this.#nameYasuo, this.#characteristic, this.#story],
    ANIMATION_TIMEOUT_500
  );

  //
  // Events listening //////////

  addIntersectionObserver(handler) {
    intersectOneTime(this.#nameUnforgiven, { threshold: 0 }, handler);
  }
}

export default new InformationView();
