import { BACKEND_URL, ADD, REMOVE, CONTENT, LOADING, ERROR } from '../config';

import {
  $,
  $_,
  $$,
  classRemove,
  intersectOneTime,
  mapMarkup,
  promisifyLoadingImage,
} from '../utils';

class GalleryView {
  #section;

  #gallery;
  #images; // After fetching
  #galleryChosen;
  #logos; // After fetching

  #galleryLoading;
  #galleryError;
  #galleryErrorButton;

  constructor() {
    this.#section = $('.gallery__container.section');

    this.#gallery = $('.gallery');
    this.#galleryChosen = $('.gallery-chosen');

    this.#galleryLoading = $('.gallery__loading');
    this.#galleryError = $('.gallery__error');
    this.#galleryErrorButton = $_(this.#galleryError, 'button');
  }

  displayContent(state) {
    classRemove(ADD, this.#galleryLoading, this.#galleryError, this.#gallery);

    if (state === LOADING) classRemove(REMOVE, this.#galleryLoading);
    if (state === ERROR) classRemove(REMOVE, this.#galleryError);
    if (state === CONTENT) classRemove(REMOVE, this.#gallery);
  }

  #generateImageMarkup = gallery => {
    const markupCallback = (item, index) => `
      <div class="gallery__image gallery__image--${index}">
        <img src="" alt="${item.title}">
        <div class="gallery__image-overlay">
          <h1 class="gallery__image-overlay-title">${item.title}</h1>
        </div>
      </div>
    `;

    return mapMarkup(gallery, markupCallback);
  };

  #generateLogoMarkup = gallery => {
    const markupCallback = item => {
      const turnWhite = item.logo.color ? 'turn-white' : '';
      return `<img class="gallery-chosen-image ${turnWhite}" src="" alt="${item.title}">`;
    };

    return mapMarkup(gallery, markupCallback);
  };

  async #createLogos(gallery) {
    const markup = this.#generateLogoMarkup(gallery);
    this.#galleryChosen.insertAdjacentHTML('afterbegin', markup);

    this.#logos = $$('.gallery-chosen-image');

    const promises = [...this.#logos].map((logo, index) =>
      promisifyLoadingImage(logo, `${BACKEND_URL}${gallery[index].logo.link}`)
    );

    await Promise.all(promises);
  }

  async #createImages(gallery) {
    const markup = this.#generateImageMarkup(gallery);
    this.#gallery.insertAdjacentHTML('beforeend', markup);

    this.#images = $$('.gallery__image img');

    const promises = [...this.#images].map((image, index) =>
      promisifyLoadingImage(image, `${BACKEND_URL}${gallery[index].image}`)
    );

    await Promise.all(promises);
  }

  async createGallery(gallery) {
    await Promise.all([
      this.#createImages(gallery),
      this.#createLogos(gallery),
    ]);
  }

  addIntersectionObserver(handler) {
    const options = {
      root: null,
      threshold: 0.3,
    };

    intersectOneTime(this.#section, options, handler);
    this.#galleryErrorButton.addEventListener('click', handler);
  }
}

export default new GalleryView();
