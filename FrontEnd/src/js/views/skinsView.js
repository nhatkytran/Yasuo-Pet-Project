import {
  BACKEND_URL,
  ANIMATION_TIMEOUT_400,
  ADD,
  REMOVE,
  CONTENT,
  LOADING,
  ERROR,
  LEFT,
  RIGHT,
} from '../config';

import {
  $,
  $_,
  $$,
  classRemove,
  debounce,
  intersectOneTime,
  mapMarkup,
  promisifyLoadingImage,
} from '../utils';

class SkinsView {
  #section = $('.skins.section');

  #headerLogo = $('.skins-container__header-logo');
  #imagesContainer = $('.skins-images');
  #images;

  #skinsOverlayLoading = $('.skins-overlay__loading');
  #skinsOverlayError = $('.skins-overlay__error');
  #skinsOverlayErrorButton = $_(this.#skinsOverlayError, 'button');

  #buttonLeftContainer = $('.skins-btn__left');
  #buttonLeft = $_(this.#buttonLeftContainer, '.btn__circle-small');
  #buttonRightContainer = $('.skins-btn__right');
  #buttonRight = $_(this.#buttonRightContainer, '.btn__circle-small');

  #exploreDesktop = $('.skins-overlay__about-explore-btn');
  #exploreMobile = $('.skins-overlay__mobile-explore');

  #titleBoard = $('.skins-overlay__container-big');
  #titleBoardNameContainer = $('.skins-overlay__about-who');
  #titleBoardPriceContainer = $('.skins-overlay__about-more-price');
  #titleBoardOrderContainer = $('.skins-overlay__about-more-order');

  displayContent(state) {
    classRemove(
      ADD,
      this.#imagesContainer,
      this.#skinsOverlayLoading,
      this.#skinsOverlayError,
      this.#buttonLeftContainer,
      this.#buttonRightContainer,
      this.#titleBoard,
      this.#exploreMobile
    );

    if (state === LOADING) classRemove(REMOVE, this.#skinsOverlayLoading);
    if (state === ERROR) classRemove(REMOVE, this.#skinsOverlayError);
    if (state === CONTENT) {
      classRemove(
        REMOVE,
        this.#imagesContainer,
        this.#buttonLeftContainer,
        this.#buttonRightContainer,
        this.#titleBoard,
        this.#exploreMobile
      );
    }
  }

  #generateImageMarkup = skins => {
    const markupCallback = skin =>
      `<img class="skins-images__slider" src="" alt="${skin.releaseYear} - ${skin.inCollection} - ${skin.name}">`;

    return mapMarkup(skins, markupCallback);
  };

  async createImages(skins) {
    const markup = this.#generateImageMarkup(skins);

    this.#imagesContainer.innerHTML = '';
    this.#imagesContainer.insertAdjacentHTML('afterbegin', markup);

    this.#images = $$('.skins-images__slider');

    const promises = [...this.#images].map((image, index) =>
      promisifyLoadingImage(image, `${BACKEND_URL}${skins[index].image}`)
    );

    await Promise.all(promises);
  }

  countImages = () => this.#images.length;

  animateImageZIndex(options) {
    const { prevRightIndex, prevLeftIndex, rightIndex, leftIndex } = options;
    this.#images[prevRightIndex]?.classList.remove('z-index-1-neg');
    this.#images[prevLeftIndex]?.classList.remove('z-index-1-neg');
    this.#images[rightIndex]?.classList.add('z-index-1-neg');
    this.#images[leftIndex]?.classList.add('z-index-1-neg');
  }

  imageTranslateX = (sideIndex, translate) =>
    (this.#images[sideIndex].style.transform = `translateX(${translate}%)`);

  titleBoard = ({ name, price, monetaryUnit, order, total }) => {
    this.#titleBoardNameContainer.innerHTML = `<h1 class="skins-overlay__about-who-name">${name}</h1>`;
    this.#titleBoardOrderContainer.innerHTML = `<span>${order} / ${total}</span>`;
    this.#titleBoardPriceContainer.innerHTML = `
      <span>PRICE</span>
      <span class="skins-overlay__about-more-price-separate">:</span>
      <span class="skins-overlay__about-more-price-number">${
        price === 0 ? 'No Sale' : `${price}${monetaryUnit}`
      }</span>
    `;
  };

  #headerLogoDingdongRemove = debounce(
    () => this.#headerLogo.classList.remove('dingdong'),
    ANIMATION_TIMEOUT_400,
    this
  );

  headerLogoDingdong() {
    this.#headerLogo.classList.add('dingdong');
    this.#headerLogoDingdongRemove();
  }

  #exploreMobileDingdongRemove = debounce(
    () => this.#exploreMobile.classList.remove('dingdong'),
    ANIMATION_TIMEOUT_400,
    this
  );

  exploreMobileDingdong() {
    this.#exploreMobile.classList.add('dingdong');
    this.#exploreMobileDingdongRemove();
  }

  //
  // Events listening //////////

  addIntersectionObserver(handler) {
    intersectOneTime(this.#section, { threshold: 0.3 }, handler);
    this.#skinsOverlayErrorButton.addEventListener('click', handler);
  }

  addSlideHandler(handler) {
    this.#buttonLeft.addEventListener('click', handler.bind(null, LEFT));
    this.#buttonRight.addEventListener('click', handler.bind(null, RIGHT));
  }

  addExploreSkinsHandler(handler) {
    this.#exploreDesktop.addEventListener('click', handler);
  }
}

export default new SkinsView();
