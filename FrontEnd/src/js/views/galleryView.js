import { BACKEND_URL, ADD, REMOVE, CONTENT, LOADING, ERROR } from '../config';

import {
  $,
  $_,
  $$_,
  classRemove,
  intersectOneTime,
  mapMarkup,
  promisifyLoadingImage,
} from '../utils';

class GalleryView {
  #section = $('.gallery__container.section');

  #galleryImagesContainer = $('.gallery__images');
  #imageWrappers;
  #images;

  #galleryLoading = $('.gallery__loading');
  #galleryError = $('.gallery__error');
  #galleryErrorButton = $_(this.#galleryError, 'button');

  displayContent(state) {
    classRemove(
      ADD,
      this.#galleryLoading,
      this.#galleryError,
      this.#galleryImagesContainer
    );

    if (state === LOADING) classRemove(REMOVE, this.#galleryLoading);
    if (state === ERROR) classRemove(REMOVE, this.#galleryError);
    if (state === CONTENT) classRemove(REMOVE, this.#galleryImagesContainer);
  }

  #generateGalleryMarkup = gallery => {
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

  async createGallery(gallery) {
    const markup = this.#generateGalleryMarkup(gallery);

    this.#galleryImagesContainer.innerHTML = '';
    this.#galleryImagesContainer.insertAdjacentHTML('afterbegin', markup);
    this.#imageWrappers = $$_(this.#galleryImagesContainer, '.gallery__image');
    this.#images = $$_(this.#galleryImagesContainer, 'img');

    this.#imageWrappers.forEach((item, index) =>
      item.setAttribute('data-index', index)
    );

    await Promise.all(
      [...this.#images].map((image, index) =>
        promisifyLoadingImage(image, `${BACKEND_URL}${gallery[index].image}`)
      )
    );
  }

  //
  // Events listening //////////

  addIntersectionObserver(handler) {
    intersectOneTime(this.#section, { threshold: 0.3 }, handler);
    this.#galleryErrorButton.addEventListener('click', handler);
  }

  addChooseGalleryHandler(handler) {
    this.#galleryImagesContainer.addEventListener('click', event => {
      const target = event.target.closest('.gallery__image');
      if (target) handler(Number(target.dataset.index));
    });
  }
}

export default new GalleryView();
