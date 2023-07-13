import {
  BACKEND_URL,
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
  mapMarkup,
  promisifyLoadingImage,
} from '../utils';

class SkinsView {
  #section;

  #headerLogo;
  #imagesContainer;
  #images;

  #skinsOverlayLoading;
  #skinsOverlayError;
  #skinsOVerlayErrorButton;

  #buttonQuestion;

  #buttonLeftContainer;
  #buttonLeft;
  #buttonRightContainer;
  #buttonRight;

  #buySkinsQuestionButton;
  #exploreDesktop;
  #exploreMobile;

  #titleBoard;
  #titleBoardNameContainer;
  #titleBoardPriceContainer;
  #titleBoardOrderContainer;

  constructor() {
    this.#section = $('.skins.section');

    this.#headerLogo = $('.skins-container__header-logo');
    this.#imagesContainer = $('.skins-images');

    const skinsOverlay = '.skins-overlay';

    this.#skinsOverlayLoading = $(`${skinsOverlay}__loading`);
    this.#skinsOverlayError = $(`${skinsOverlay}__error`);
    this.#skinsOVerlayErrorButton = $_(this.#skinsOverlayError, 'button');

    this.#buttonQuestion = $(`${skinsOverlay}__question`);

    this.#buttonLeftContainer = $('.skins-btn__left');
    this.#buttonLeft = $_(this.#buttonLeftContainer, '.btn__circle-small');
    this.#buttonRightContainer = $('.skins-btn__right');
    this.#buttonRight = $_(this.#buttonRightContainer, '.btn__circle-small');

    this.#buySkinsQuestionButton = $(`${skinsOverlay}__question`);
    this.#exploreDesktop = $(`${skinsOverlay}__about-explore-btn`);
    this.#exploreMobile = $(`${skinsOverlay}__explore`);

    this.#titleBoard = $(`${skinsOverlay}__container-big`);
    this.#titleBoardNameContainer = $(`${skinsOverlay}__about-who`);
    this.#titleBoardPriceContainer = $(`${skinsOverlay}__about-more-price`);
    this.#titleBoardOrderContainer = $(`${skinsOverlay}__about-more-order`);

    // Buy default --> Hide images, buttons, titleBoard
    this.displayContent();
  }

  displayContent(state) {
    classRemove(
      ADD,
      this.#imagesContainer,
      this.#skinsOverlayLoading,
      this.#skinsOverlayError,
      this.#buttonQuestion,
      this.#buttonLeftContainer,
      this.#buttonRightContainer,
      this.#titleBoard
    );
    this.#exploreMobile.classList.add('hide');

    if (state === LOADING) classRemove(REMOVE, this.#skinsOverlayLoading);
    if (state === ERROR) classRemove(REMOVE, this.#skinsOverlayError);
    if (state === CONTENT) {
      classRemove(
        REMOVE,
        this.#imagesContainer,
        this.#buttonQuestion,
        this.#buttonLeftContainer,
        this.#buttonRightContainer,
        this.#titleBoard
      );
      this.#exploreMobile.classList.remove('hide');
    }
  }

  animateImageZIndex(options) {
    const { side, prevRightIndex, prevLeftIndex } = options;

    this.#images[prevRightIndex]?.classList.remove('z-index-1-neg');
    this.#images[prevLeftIndex]?.classList.remove('z-index-1-neg');

    if (side === 'left')
      this.#images[options.rightIndex].classList.add('z-index-1-neg');
    if (side === 'right')
      this.#images[options.leftIndex].classList.add('z-index-1-neg');
  }

  #generateImageMarkup = skins => {
    const markupCallback = skin =>
      `<img class="skins-images__slider" src="" alt="${skin.releaseYear} - ${skin.collection} - ${skin.name}">`;

    return mapMarkup(skins, markupCallback);
  };

  async createImages(skins) {
    const markup = this.#generateImageMarkup(skins);
    this.#imagesContainer.insertAdjacentHTML('afterbegin', markup);

    this.#images = $$('.skins-images__slider');

    const promises = [...this.#images].map((image, index) =>
      promisifyLoadingImage(image, `${BACKEND_URL}${skins[index].image}`)
    );

    await Promise.all(promises);
  }

  countImages = () => this.#images.length;

  imageTranslateX = (sideIndex, translate) =>
    (this.#images[sideIndex].style.transform = `translateX(${translate}%)`);

  headerLogoDingdong() {
    this.#headerLogo.classList.add('dingdong');
    // debounce
    setTimeout(() => {
      this.#headerLogo.classList.remove('dingdong');
    }, 400);
  }

  #titleBoardItem = (container, markup) => (container.innerHTML = markup);

  titleBoardName = name =>
    this.#titleBoardItem(
      this.#titleBoardNameContainer,
      `<h1 class="skins-overlay__about-who-name">${name}</h1>`
    );

  titleBoardPrice = (price, unit) => {
    const priceMarkup = price === 0 ? 'NO SALE' : `${price}${unit}`;

    this.#titleBoardItem(
      this.#titleBoardPriceContainer,
      `
        <span>PRICE</span>
        <span class="skins-overlay__about-more-price-separate">:</span>
        <span class="skins-overlay__about-more-price-number">${priceMarkup}</span>
      `
    );
  };

  titleBoardOrder = (order, total) =>
    this.#titleBoardItem(
      this.#titleBoardOrderContainer,
      `<span>${order} / ${total}</span>`
    );

  addIntersectionObserver(handler) {
    const options = {
      root: null,
      threshold: 0.3,
    };

    const callback = (entries, observerSelf) => {
      if (entries[0].isIntersecting) {
        handler();
        observerSelf.disconnect();
      }
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.#section);

    // addIntersectionObserver only runs one time used for first fetching data
    // so we can listen button error to fetch again
    this.#skinsOVerlayErrorButton.addEventListener('click', handler);
  }

  addSlideHandler(handler) {
    this.#buttonLeft.addEventListener('click', handler.bind(null, LEFT));
    this.#buttonRight.addEventListener('click', handler.bind(null, RIGHT));
  }

  addBuySkinsQuestionHandler(handler) {
    this.#buySkinsQuestionButton.addEventListener('click', handler);
  }

  addExploreSkinsHandler(handler) {
    this.#exploreDesktop.addEventListener('click', handler);
    this.#exploreMobile.addEventListener('click', handler);
  }
}

export default new SkinsView();
