import { BACKEND_URL, ADD, REMOVE, CONTENT, LOADING, ERROR } from '../config';

import {
  $,
  $_,
  classRemove,
  intersectOneTime,
  promisifyLoadingImage,
} from '../utils';

const ruinedBg = '.ruined__bg';

class RuinedView {
  #section = $('.ruined.section');

  #mainImageWrapper = $(`${ruinedBg}-image-wrapper`);
  #mainImage;
  #subImageWrapper = $('.ruined__king');
  #subImage;
  #subImageHelper;

  #ruinedLoading = $(`${ruinedBg}-loading`);
  #ruinedError = $(`${ruinedBg}-error`);
  #ruinedErrorButton = $_(this.#ruinedError, 'button');

  #ruinedButton = $('.ruined__button');

  displayContent(state) {
    classRemove(
      ADD,
      this.#mainImageWrapper,
      this.#subImageWrapper,
      this.#ruinedLoading,
      this.#ruinedError,
      this.#ruinedButton
    );

    if (state === LOADING) classRemove(REMOVE, this.#ruinedLoading);
    if (state === ERROR) classRemove(REMOVE, this.#ruinedError);
    if (state === CONTENT)
      classRemove(
        REMOVE,
        this.#mainImageWrapper,
        this.#mainImage,
        this.#subImageWrapper,
        this.#subImage,
        this.#subImageHelper,
        this.#ruinedButton
      );
  }

  async #createMainImage(image) {
    const markup = `<img class="ruined__bg-image fade-in-500 remove" draggable="false" src="" alt="${image.alt}">`;

    this.#mainImageWrapper.innerHTML = '';
    this.#mainImageWrapper.insertAdjacentHTML('afterbegin', markup);
    this.#mainImage = $('.ruined__bg-image');

    await promisifyLoadingImage(this.#mainImage, `${BACKEND_URL}${image.link}`);
  }

  async #createSubImage(image) {
    const markup = `
      <img class="ruined__king-veigo fade-in-500 remove" draggable="false" src="" alt="${image.alt}" />
      <img class="ruined__king-helper fade-in-500 remove" draggable="false" src="" alt="${image.alt} - Helper">
    `;

    this.#subImageWrapper.innerHTML = '';
    this.#subImageWrapper.insertAdjacentHTML('afterbegin', markup);
    this.#subImage = $('.ruined__king-veigo');
    this.#subImageHelper = $('.ruined__king-helper');

    await Promise.all([
      promisifyLoadingImage(this.#subImage, `${BACKEND_URL}${image.link}`),
      promisifyLoadingImage(
        this.#subImageHelper,
        `${BACKEND_URL}${image.linkHelper}`
      ),
    ]);
  }

  async createImages(images) {
    await Promise.all([
      this.#createMainImage(images.main),
      this.#createSubImage(images.sub),
    ]);
  }

  //
  // Events listening //////////

  addIntersectionObserver(handler) {
    intersectOneTime(this.#section, { threshold: 0.3 }, handler);
    this.#ruinedErrorButton.addEventListener('click', handler);
  }

  addExploreHandler(handler) {
    this.#ruinedButton.addEventListener('click', handler);
  }
}

export default new RuinedView();
