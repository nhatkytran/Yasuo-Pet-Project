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
  #section = $('.skins2.section');

  #imagesWrapper = $('.skins2-img-wrapper');
  #images;

  #skinsLoading = $('.skins2-img-loading');
  #skinsError = $('.skins2-img-error');
  #skinsErrorButton = $_(this.#skinsError, 'button');

  #slider = $('.skins2-slider');
  #sliderDivImagesWrapper = $('.skins2-slider-list');
  #sliderDivImages;

  #mbSlider = $('.skins2-mobile-slider');
  #mbSliderDivImagesWrapper = $('.skins2-mobile-slider__list');
  #mbSliderDivImages;

  #slideItemHeight;
  #slideButtons;

  #mbSliderWidth;
  #mbSlideItemWidth;
  #mbSlideButtons;

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

  async #createItem(skins, ...images) {
    const promises = images.map((image, index) =>
      promisifyLoadingImage(image, `${BACKEND_URL}${skins[index].image}`)
    );
    await Promise.all(promises);
  }

  async createImages(skins) {
    const stringCallback = (active, _, imageAlt) =>
      `<img class="skins2-img ${active}" src="" alt="${imageAlt}">`;
    const markup = this.#generateItemMarkup(skins, stringCallback);

    this.#imagesWrapper.innerHTML = '';
    this.#imagesWrapper.insertAdjacentHTML('afterbegin', markup);
    this.#images = $$('.skins2-img');

    await this.#createItem(skins, ...this.#images);
  }

  async createSlider(skins) {
    const stringCallback = (active, name, imageAlt) => `
      <li class="skins2-slider-item">
        <button class="button skins2-button ${active}">
        <img class="skins2-button__image" src="" alt="${imageAlt}" draggable="false">
          <div class="skins2-button__name">
            <p>${name}</p>
          </div>
        </button>
      </li>
    `;
    const markup = this.#generateItemMarkup(skins, stringCallback);

    this.#sliderDivImagesWrapper.innerHTML = '';
    this.#sliderDivImagesWrapper.insertAdjacentHTML('afterbegin', markup);
    this.#sliderDivImages = $$('.skins2-button__image');

    await this.#createItem(skins, ...this.#sliderDivImages);
  }

  async createMbSlider(skins) {
    const stringCallback = (active, name, imageAlt) => `
      <li class="skins2-mobile-slider__item ${active}">
        <button class="button skins2-mobile-slider__button">
          <div class="skins2-mobile-slider__image">
            <img src="" alt="${imageAlt}" draggable="false">
            <div class="skins2-mobile-slider__image-overlay fade-in"></div>
          </div>
          <p class="skins2-mobile-slider__name">${name}</p>
        </button>
      </li>
    `;
    const markup = this.#generateItemMarkup(skins, stringCallback);

    this.#mbSliderDivImagesWrapper.innerHTML = '';
    this.#mbSliderDivImagesWrapper.insertAdjacentHTML('afterbegin', markup);
    this.#mbSliderDivImages = $$('.skins2-mobile-slider__image img');

    await this.#createItem(skins, ...this.#mbSliderDivImages);
  }

  prepareSlidersData() {
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

    this.setMbSliderWidth();
  }

  // width of `this.#mbSlider` is equal to width of `this.#imagesWrapper`
  // but `this.#mbSlider` can be display none sometimes (responsive --> none)
  // so we use width of `this.#imagesWrapper`
  setMbSliderWidth = () =>
    (this.#mbSliderWidth = this.#imagesWrapper.getBoundingClientRect().width);

  getSlideItemHeight = () => this.#slideItemHeight;
  getMbSlideItemWidth = () => this.#mbSlideItemWidth;

  getMbSlideItemMiddlePoint = (itemWidth, index) => {
    const overflow = this.#mbSlider.getBoundingClientRect().x;
    const storeOverflow = this.#mbSlideButtons[index].getBoundingClientRect().x;
    return (storeOverflow - overflow) / REM + itemWidth / 2;
  };

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

  countTranslateY = index => ((index - 1) * -this.#slideItemHeight) / REM;
  countMbTranslateX = index => {
    // Why 1 / 2 ? We need a point is the middle of 'this.#mbSlideItemWidth'
    const distance = this.#mbSlideItemWidth * (index + 1 / 2);
    const translateX = this.#mbSliderWidth / 2 - distance;
    return translateX / REM;
  };

  chooseMainImage = (index, prevIndex) => {
    this.#images[prevIndex].classList.remove('active');
    this.#images[index].classList.add('active');
  };

  //
  // Events listening //////////

  addIntersectionObserver(handler) {
    intersectOneTime(this.#section, { threshold: 0.3 }, handler);
    this.#skinsErrorButton.addEventListener('click', handler);
  }

  addChooseSlideHandler(handler) {
    this.#slider.addEventListener('click', event => {
      const target = event.target.closest('.skins2-button');
      if (target) handler(Number(target.dataset.slideButtonIndex));
    });
  }

  addDragSlideHandler(startHandler, progressHandler, stopHandler) {
    this.#slider.addEventListener('mousedown', startHandler);
    document.addEventListener('mousemove', progressHandler);
    document.addEventListener('mouseup', stopHandler);
    const options = { passive: true };
    this.#slider.addEventListener('touchstart', startHandler, options);
    document.addEventListener('touchmove', progressHandler, options);
    document.addEventListener('touchend', stopHandler);
  }

  addChooseMbSlideHandler(handler) {
    this.#mbSlider.addEventListener('click', event => {
      const target = event.target.closest('.skins2-mobile-slider__item');
      if (target) handler(Number(target.dataset.slideButtonIndex));
    });
  }

  addDragMbSlideHandler(startHandler, progressHandler, stopHandler) {
    this.#mbSlider.addEventListener('mousedown', startHandler);
    document.addEventListener('mousemove', progressHandler);
    document.addEventListener('mouseup', stopHandler);
    const options = { passive: true };
    this.#mbSlider.addEventListener('touchstart', startHandler, options);
    document.addEventListener('touchmove', progressHandler, options);
    document.addEventListener('touchend', stopHandler);
  }

  addMbSliderResizeHandler(handler) {
    window.addEventListener('resize', handler);
  }
}

export default new Skins2View();
