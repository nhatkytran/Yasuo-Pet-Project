import { BACKEND_URL, ADD, REMOVE, CONTENT, LOADING, ERROR } from '../config';

import {
  $,
  $_,
  classRemove,
  intersectOneTime,
  promisifyLoadingImage,
} from '../utils';

class RuinedView {
  #section;

  #mainImageWrapper;
  #subImageWrapper;

  #ruinedLoading;
  #ruinedError;
  #ruinedErrorButton;

  constructor() {
    this.#section = $('.ruined.section');

    const ruinedBg = '.ruined__bg';

    this.#mainImageWrapper = $(`${ruinedBg}-image-wrapper`);
    this.#subImageWrapper = $('.ruined__king');

    this.#ruinedLoading = $(`${ruinedBg}-loading`);
    this.#ruinedError = $(`${ruinedBg}-error`);
    this.#ruinedErrorButton = $_(this.#ruinedError, 'button');

    this.displayContent();
  }

  displayContent(state) {
    classRemove(
      ADD,
      this.#subImageWrapper,
      this.#mainImageWrapper,
      this.#ruinedLoading,
      this.#ruinedError
    );

    if (state === LOADING) classRemove(REMOVE, this.#ruinedLoading);
    if (state === ERROR) classRemove(REMOVE, this.#ruinedError);
    if (state === CONTENT)
      classRemove(REMOVE, this.#subImageWrapper, this.#mainImageWrapper);
  }

  #generateMainImageMarkup = image =>
    `
      <img class="ruined__bg-image" src="" alt="${image.alt}">
    `;

  #generateSubImageMarkup = image =>
    `
      <img class="ruined__king-veigo" src="" alt="${image.alt}" />
      <img class="ruined__king-helper" src="" alt="${image.alt} - Helper">
    `;

  async #createMainImage(image) {
    const markup = this.#generateMainImageMarkup(image);
    this.#mainImageWrapper.insertAdjacentHTML('afterbegin', markup);

    const mainImage = $('.ruined__bg-image');

    await promisifyLoadingImage(mainImage, `${BACKEND_URL}${image.link}`);
  }

  async #createSubImage(image) {
    const markup = this.#generateSubImageMarkup(image);
    this.#subImageWrapper.insertAdjacentHTML('afterbegin', markup);

    const subImage = $('.ruined__king-veigo');
    const subImageHelper = $('.ruined__king-helper');

    const promises = [
      promisifyLoadingImage(subImage, `${BACKEND_URL}${image.link}`),
      promisifyLoadingImage(
        subImageHelper,
        `${BACKEND_URL}${image.linkHelper}`
      ),
    ];

    await Promise.all(promises);
  }

  async createImages(images) {
    await Promise.all([
      this.#createMainImage(images.main),
      this.#createSubImage(images.sub),
    ]);
  }

  addIntersectionObserver(handler) {
    const options = {
      root: null,
      threshold: 0.3,
    };

    intersectOneTime(this.#section, options, handler);
    this.#ruinedErrorButton.addEventListener('click', handler);
  }
}

export default new RuinedView();
