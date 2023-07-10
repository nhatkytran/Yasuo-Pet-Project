import { ADD, REMOVE, CONTENT, LOADING, ERROR } from '../config';
import { $, $_, $$, classRemove } from '../utils';

class SkinsView {
  #section;

  #imagesContainer;
  #images;

  #skinsOverlay;
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

    // test
    this.#images = $$('.skins-images__slider');

    console.log(this.#images);

    this.#skinsOverlay = $('.skins-overlay');
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

    // this.displayContent();

    this.#images = [...this.#images];

    function test() {
      const length = this.#images.length;
      const point = Math.ceil(length / 2);

      const currentImageIndex = 0; // [-floor:(ceil - 1)]

      let count = 0;

      this.#images.forEach((_, index) => {
        count += 1;

        let asIndex = index - currentImageIndex;
        let shouldIndex;

        // if (count <= point) {
        // } else {
        // }

        this.#images[asIndex].style.transform = `translateX(${
          (index - 2) * 100
        }%)`;
      });

      // this.#buttonLeft.addEventListener('click')
    }

    test.call(this);
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

  createImages(images) {
    console.log(images);
  }

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
