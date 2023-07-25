import { CONTENT, LOADING, ERROR, REM, X, Y } from '../config';
import { checkEmptyObject } from '../utils';
import state, { fetchSkinsData } from '../model';

class Skins2Controller {
  #skins2View;

  slideActions;
  mbSlideActions;

  constructor(skins2View) {
    this.#skins2View = skins2View;
  }

  #fetchData = async () => {
    try {
      this.#skins2View.displayContent(LOADING);

      const data = await fetchSkinsData();

      await Promise.all([
        this.#skins2View.createImages(data.skins),
        this.#skins2View.createSlider(data.skins),
        this.#skins2View.createMbSlider(data.skins),
      ]);

      state.skinsData = data;

      this.#skins2View.prepareDataForSliders();
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      this.#skins2View.displayContent(ERROR);
    }
  };

  handleData = async () => {
    // Skins and Skins2 use the same data, so only one of them needs to fetch data
    if (checkEmptyObject(state.skinsData)) await this.#fetchData();
    if (!checkEmptyObject(state.skinsData))
      this.#skins2View.displayContent(CONTENT);

    this.mbSlideActions.init();
  };

  #handleSlider = () => {
    let prevIndex = 1; // By default, index of 1 is active
    let currentTranslateY = 0; // `rem` unit
    let isDragged = false;
    let isReadyToDrag = false;
    let startClientY;
    let newClientY;

    const chooseSlide = (index, auto = false) => {
      if (isDragged) return;

      currentTranslateY = this.#skins2View.countTranslateY(index);

      this.#skins2View.slide(currentTranslateY);
      this.#skins2View.slideAnimate(index, prevIndex);

      if (!auto) this.#chooseMainImage(index, prevIndex, Y);

      prevIndex = index;
    };

    const dragStart = event => {
      isReadyToDrag = true;
      startClientY = event.clientY;
    };

    const dragProgress = event => {
      if (!isReadyToDrag) return;

      isDragged = true;
      newClientY = event.clientY;

      const diff = newClientY - startClientY;
      if (diff !== 0) this.#skins2View.slide(currentTranslateY + diff / REM);
    };

    const adjustCurrentTranslateX = () => {
      const slideItemHeight = this.#skins2View.getSlideItemHeight() / REM;
      const totalItems = state.skinsData.skins.length;

      if (currentTranslateY > slideItemHeight)
        currentTranslateY = slideItemHeight;
      if (currentTranslateY < -(totalItems - 2) * slideItemHeight)
        currentTranslateY = -(totalItems - 2) * slideItemHeight;

      currentTranslateY = Math.round(currentTranslateY / 10) * 10;
    };

    const dragStop = () => {
      isReadyToDrag = false;

      if (!isDragged) return;
      isDragged = false; // `click` event before `mouseup` event

      currentTranslateY += (newClientY - startClientY) / REM;
      adjustCurrentTranslateX();

      this.#skins2View.slide(currentTranslateY);
    };

    return {
      chooseSlide,
      dragStart,
      dragProgress,
      dragStop,
    };
  };

  slideActions = this.#handleSlider();

  #handleMbSlider = () => {
    let prevIndex = 1;
    let currentTranslateXDefault;
    let currentTranslateX;
    let isDragged = false;
    let isReadyToDrag = false;
    let startClientX;
    let newClientX;

    const init = () => {
      currentTranslateXDefault = this.#skins2View.countMbTranslateX(1);
      currentTranslateX = currentTranslateXDefault;
      this.#skins2View.mbSlide(currentTranslateX);
    };

    const chooseMbSlide = (index, auto = false) => {
      if (isDragged) return;

      currentTranslateX = this.#skins2View.countMbTranslateX(index);

      this.#skins2View.mbSlide(currentTranslateX);
      this.#skins2View.mbSlideAnimate(index, prevIndex);

      if (!auto) this.#chooseMainImage(index, prevIndex, X);

      prevIndex = index;
    };

    const dragStart = event => {
      isReadyToDrag = true;
      startClientX = event.clientX || event.touches[0].clientX;
    };

    const dragProgress = event => {
      if (!isReadyToDrag) return;

      isDragged = true;
      newClientX = event.clientX || event.touches[0].clientX;

      const diff = newClientX - startClientX;
      if (diff !== 0) this.#skins2View.mbSlide(currentTranslateX + diff / REM);
    };

    const adjustCurrentTranslateX = () => {
      const totalItems = state.skinsData.skins.length;
      const itemWidth = this.#skins2View.getMbSlideItemWidth() / REM;

      const pointDefault = currentTranslateXDefault + itemWidth; // Remember default index is 1
      const limitAfter = -(itemWidth * (totalItems - 1) - pointDefault);

      if (currentTranslateX > pointDefault) currentTranslateX = pointDefault;
      if (currentTranslateX < limitAfter) currentTranslateX = limitAfter;

      const middle = itemWidth / 2;

      // translateX for left indices (index 0)
      if (Math.abs(pointDefault - currentTranslateX) < middle)
        return (currentTranslateX = pointDefault);

      // translateX for left indices (index 1, 2, 3,...)
      for (let i = 0; i < totalItems - 1; i++) {
        const translateX = currentTranslateXDefault - i * itemWidth;

        if (Math.abs(translateX - currentTranslateX) < middle) {
          currentTranslateX = translateX;
          break;
        }
      }
    };

    const dragStop = () => {
      isReadyToDrag = false;

      if (!isDragged) return;
      isDragged = false;

      const diff = newClientX - startClientX;
      if (diff === 0) return;

      currentTranslateX += diff / REM;
      adjustCurrentTranslateX();

      this.#skins2View.mbSlide(currentTranslateX);
    };

    const resize = () => {
      this.#skins2View.setMbSliderWidth(); // Keep data in sync in both `controller` and `view`
      currentTranslateXDefault = this.#skins2View.countMbTranslateX(1);

      adjustCurrentTranslateX();
      this.#skins2View.mbSlide(currentTranslateX);
    };

    return {
      init,
      chooseMbSlide,
      dragStart,
      dragProgress,
      dragStop,
      resize,
    };
  };

  mbSlideActions = this.#handleMbSlider();

  #chooseMainImage = (index, prevIndex, side) => {
    this.#skins2View.chooseMainImage(index, prevIndex);

    if (side === X) this.slideActions.chooseSlide(index, true);
    if (side === Y) this.mbSlideActions.chooseMbSlide(index, true);
  };
}

export default Skins2Controller;
