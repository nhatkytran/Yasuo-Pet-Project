import {
  BACKEND_URL,
  ANIMATION_TIMEOUT,
  ADD,
  REMOVE,
  CONTENT,
  LOADING,
  ERROR,
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

  #exploreDesktop;
  #exploreMobile;

  #titleBoard;

  constructor() {
    this.#section = $('.skins.section');

    this.#imagesContainer = $('.skins-images');
    // this.#images; // Selected after displaying content

    this.#skinsOverlayLoading = $('.skins-overlay__loading');
    this.#skinsOverlayError = $('.skins-overlay__error');
    this.#skinsOVerlayErrorButton = $_(this.#skinsOverlayError, 'button');

    this.#buttonQuestion = $('.skins-overlay__question');

    this.#buttonLeftContainer = $('.skins-btn__left');
    this.#buttonLeft = $_(this.#buttonLeftContainer, '.btn__circle-small');
    this.#buttonRightContainer = $('.skins-btn__right');
    this.#buttonRight = $_(this.#buttonRightContainer, '.btn__circle-small');

    this.#exploreDesktop = $('.skins-overlay__about-explore-btn');
    this.#exploreMobile = $('.skins-overlay__explore');

    this.#titleBoard = $('.skins-overlay__container-big');

    this.displayContent();

    // this.#images = [...this.#images];

    function test() {
      const length = this.#images.length;
      const ceil = Math.ceil(length / 2); // Number of slides on the right side (include current slide)
      const floor = Math.floor(length / 2); // On the left side

      let currentIndex = 0;
      let rightIndices = [];
      let leftIndices = [];
      let prevRightIndex = null;
      let prevLeftIndex = null;

      function slide(currentIndex, side) {
        // Handle z-index-1-neg (this is just the name of a class `_utils.scss`)
        // When translateX, the last image can precede and take up the current view
        // So, we need to set z-index = -1 for the last image (base on left or right)
        // With each called, we remove previous setting z-index
        this.#images[prevRightIndex]?.classList.remove('z-index-1-neg');
        this.#images[prevLeftIndex]?.classList.remove('z-index-1-neg');

        if (side === 'right') {
          // 3 4 0 1 2 --> Click `right` --> // 3 0 1 2 4
          // So `leftIndex` if affected
          const leftIndex = leftIndices[0];
          console.log(leftIndex);
          this.#images[leftIndex].classList.add('z-index-1-neg');
          prevLeftIndex = leftIndex;
        }

        if (side === 'left') {
          const rightIndex = rightIndices.at(-1);
          this.#images[rightIndex].classList.add('z-index-1-neg');
          prevRightIndex = rightIndex;
        }

        // Find indices on the right side
        rightIndices = Array(ceil)
          .fill(null)
          .map((_, index) => {
            let shouldIndex = currentIndex + index;
            if (shouldIndex >= length) shouldIndex %= length;
            return shouldIndex;
          });

        console.log(rightIndices);

        // Find indices on the left side
        leftIndices = Array(floor)
          .fill(null)
          .map((_, index) => {
            let shouldIndex = length - floor + currentIndex + index;
            if (shouldIndex >= length) shouldIndex %= length;
            return shouldIndex;
          });

        console.log(leftIndices);

        // Control translateX - Right
        rightIndices.forEach((rightIndex, index) => {
          this.#images[rightIndex].style.transform = `translateX(${
            index * 100
          }%)`;
        });

        // Control translateX - Left
        // Reverse to calculate translateX easier
        [...leftIndices].reverse().forEach((leftIndex, index) => {
          // index -->  0  1  2
          // index --> -3 -2 -1
          this.#images[leftIndex].style.transform = `translateX(${
            (-index - 1) * 100
          }%)`;
        });
      }

      slide.call(this, currentIndex, null);

      // Prevent to click to fast
      const debounce = fn => {
        let timeout;

        return (...args) => {
          clearTimeout(timeout);
          timeout = setTimeout(() => fn(...args), ANIMATION_TIMEOUT);
        };
      };

      this.#buttonLeft.addEventListener('click', () => {
        currentIndex -= 1;
        if (currentIndex < 0) currentIndex = length - 1;
        slide.call(this, currentIndex, 'left');
      });

      this.#buttonRight.addEventListener('click', () => {
        currentIndex += 1;
        if (currentIndex === length) currentIndex = 0;
        slide.call(this, currentIndex, 'right');
      });
    }

    // test.call(this);
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

      // After fetching data successfully, `skinsController` will display content
      // Images not is in the same position --> adjust position of images
    }
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
}

export default new SkinsView();
