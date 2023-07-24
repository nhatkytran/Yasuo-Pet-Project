import {
  BACKEND_URL,
  ADD,
  REMOVE,
  CONTENT,
  LOADING,
  ERROR,
  REM,
  X,
  Y,
} from '../config';

import {
  $,
  $_,
  $$,
  classRemove,
  intersectOneTime,
  mapMarkup,
  promisifyLoadingImage,
} from '../utils';

class Skins2View {
  #section;

  #imagesWrapper;
  #images; // After fetching

  #skinsLoading;
  #skinsError;
  #skinsErrorButton;

  #slider;
  #sliderDivImagesWrapper;
  #sliderDivImages; // After fetching

  #mbSlider;
  #mbSliderDivImagesWrapper;
  #mbSliderDivImages; // After fetching

  // Value from `getBoundingClientRect` can be 0 if initialized with elements disply none
  // So we hard code some value and comnent `class` as reference
  // Value is added at `prepareDataForSliders`

  #slideItemHeight; // class: skins2-slider-item
  #slideButtons;

  #mbSliderWidth;
  #mbSlideItemWidth; // class: skins2-mobile-slider__item
  #mbSlideButtons;

  constructor() {
    this.#section = $('.skins2.section');

    const skinsImg = '.skins2-img';

    this.#imagesWrapper = $(`${skinsImg}-wrapper`);

    this.#skinsLoading = $(`${skinsImg}-loading`);
    this.#skinsError = $(`${skinsImg}-error`);
    this.#skinsErrorButton = $_(this.#skinsError, 'button');

    this.#slider = $('.skins2-slider');
    this.#sliderDivImagesWrapper = $('.skins2-slider-list');

    this.#mbSlider = $('.skins2-mobile-slider');
    this.#mbSliderDivImagesWrapper = $('.skins2-mobile-slider__list');

    this.displayContent();
  }

  displayContent(state) {
    classRemove(
      ADD,
      this.#skinsLoading,
      this.#skinsError,
      this.#slider,
      this.#mbSlider
    );

    if (state === LOADING) classRemove(REMOVE, this.#skinsLoading);
    if (state === ERROR) classRemove(REMOVE, this.#skinsError);
    if (state === CONTENT) classRemove(REMOVE, this.#slider, this.#mbSlider);
  }

  #generateItemMarkup = (skins, stringCallback) => {
    const markupCallback = (skin, index) => {
      const active = index === 1 ? 'active' : '';
      const { releaseYear, inCollection, name } = skin;
      const imageAlt = `${releaseYear} - ${inCollection} - ${name}`;

      return stringCallback(active, name, imageAlt);
    };

    return mapMarkup(skins, markupCallback);
  };

  #generateSliderDivImageMarkup = skins => {
    const stringCallback = (active, name, imageAlt) => `
      <li class="skins2-slider-item">
        <button class="button skins2-button ${active}">
        <img class="skins2-button__image" src="" alt="${imageAlt}">
          <div class="skins2-button__name">
            <p>${name}</p>
          </div>
        </button>
      </li>
    `;

    return this.#generateItemMarkup(skins, stringCallback);
  };

  #generateMbSliderDivImageMarkup = skins => {
    const stringCallback = (active, name, imageAlt) => `
      <li class="skins2-mobile-slider__item ${active}">
        <button class="button skins2-mobile-slider__button">
          <div class="skins2-mobile-slider__image">
            <img src="" alt="${imageAlt}">
            <div class="skins2-mobile-slider__image-overlay fade-in"></div>
          </div>
          <p class="skins2-mobile-slider__name">${name}</p>
        </button>
      </li>
    `;

    return this.#generateItemMarkup(skins, stringCallback);
  };

  #generateImageMarkup = skins => {
    const stringCallback = (active, _, imageAlt) => `
      <img class="skins2-img ${active}" src="" alt="${imageAlt}">
    `;

    return this.#generateItemMarkup(skins, stringCallback);
  };

  #createitemStructure(skins, generateMarkup, wrapper) {
    const markup = generateMarkup(skins);

    wrapper.innerHTML = '';
    wrapper.insertAdjacentHTML('afterbegin', markup);
  }

  async #createItem(skins, ...images) {
    const promises = images.map((image, index) =>
      promisifyLoadingImage(image, `${BACKEND_URL}${skins[index].image}`)
    );

    await Promise.all(promises);
  }

  async createSlider(skins) {
    this.#createitemStructure(
      skins,
      this.#generateSliderDivImageMarkup,
      this.#sliderDivImagesWrapper
    );

    this.#sliderDivImages = $$('.skins2-button__image');
    await this.#createItem(skins, ...this.#sliderDivImages);
  }

  async createMbSlider(skins) {
    this.#createitemStructure(
      skins,
      this.#generateMbSliderDivImageMarkup,
      this.#mbSliderDivImagesWrapper
    );

    this.#mbSliderDivImages = $$('.skins2-mobile-slider__image img');
    await this.#createItem(skins, ...this.#mbSliderDivImages);
  }

  async createImages(skins) {
    this.#createitemStructure(
      skins,
      this.#generateImageMarkup,
      this.#imagesWrapper
    );

    this.#images = $$('.skins2-img');
    await this.#createItem(skins, ...this.#images);
  }

  prepareDataForSliders() {
    const addButtonDataHTML = buttons =>
      buttons.forEach((button, index) => {
        button.setAttribute('data-slide-button-index', index);
      });

    // Desktop //////////
    this.#slideItemHeight = 100;
    this.#slideButtons = $$('.skins2-button');
    addButtonDataHTML(this.#slideButtons);

    // Mobile //////////
    this.#mbSlideItemWidth = 110;
    this.#mbSlideButtons = $$('.skins2-mobile-slider__item');
    addButtonDataHTML(this.#mbSlideButtons);

    // width of `this.#mbSlider` is equal to width of `this.#imagesWrapper`
    // but `this.#mbSlider` can be display none sometimes (responsive --> none)
    // so we use width of `this.#imagesWrapper`
    this.#mbSliderWidth = this.#imagesWrapper.getBoundingClientRect().width;
  }

  getSlideItemHeight = () => this.#slideItemHeight;
  getMbSlideItemWidth = () => this.#mbSlideItemWidth;

  slide = this.#slideFactory(Y);
  mbSlide = this.#slideFactory(X);
  #slideFactory(side) {
    return translate => {
      const wrapper =
        side === X
          ? this.#mbSliderDivImagesWrapper
          : this.#sliderDivImagesWrapper;

      wrapper.style.transform = `translate${side}(${translate}rem)`;
    };
  }

  slideAnimate = this.#slideAnimateFactory(Y);
  mbSlideAnimate = this.#slideAnimateFactory(X);
  #slideAnimateFactory(side) {
    return (index, prevIndex) => {
      const buttons = side === X ? this.#mbSlideButtons : this.#slideButtons;

      buttons[prevIndex].classList.remove('active');
      buttons[index].classList.add('active');
    };
  }

  countMbTranslateX = index => {
    // Why 1 / 2 ? We need a point is the middle of `this.#mbSlideItemWidth`
    const distance = this.#mbSlideItemWidth * (index + 1 / 2);
    console.log(distance);
    const translatePX = this.#mbSliderWidth / 2 - distance;

    return translatePX / REM;
  };

  addIntersectionObserver(handler) {
    const options = {
      root: null,
      threshold: 0.3,
    };

    intersectOneTime(this.#section, options, handler);
    this.#skinsErrorButton.addEventListener('click', handler);
  }

  addChooseSlideHandler(handler) {
    this.#slider.addEventListener('click', event => {
      const target = event.target.closest('.skins2-button');

      if (target)
        handler(Number(target.dataset.slideButtonIndex), this.#slideItemHeight);
    });
  }

  addDragSlideHandler(startHandler, progressHandler, stopHandler) {
    this.#slider.addEventListener('mousedown', startHandler);
    this.#slider.addEventListener('mousemove', progressHandler);
    this.#slider.addEventListener('mouseup', stopHandler);
    this.#slider.addEventListener('mouseleave', stopHandler);
  }

  addChooseMbSlideHandler(handler) {
    this.#mbSlider.addEventListener('click', event => {
      const target = event.target.closest('.skins2-mobile-slider__item');

      if (target)
        handler(
          Number(target.dataset.slideButtonIndex),
          this.#mbSlideItemWidth
        );
    });
  }
}

export default new Skins2View();
