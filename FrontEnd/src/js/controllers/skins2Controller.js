import { CONTENT, LOADING, ERROR, REM, X, Y } from '../config';
import { catchAsync } from '../utils';

import store from '../models/store';
import skins2Service from '../models/features/skins2/skins2Service';
import { ACTIONS } from '../models/features/skins2/reducer';

const filename = 'skins2Controller.js';

class Skins2Controller {
  #Skins2View;
  slideActions;
  mbSlideActions;

  constructor(Skins2View) {
    this.#Skins2View = Skins2View;
    this.slideActions = this.#handleSlider();
    this.mbSlideActions = this.#handleMbSlider();
  }

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      this.#Skins2View.displayContent(LOADING);

      await skins2Service.getData('/api/v1/skins/data');

      const { skins } = store.state.skins2;
      await Promise.all([
        this.#Skins2View.createImages(skins),
        this.#Skins2View.createSlider(skins),
        this.#Skins2View.createMbSlider(skins),
      ]);

      store.dispatch(ACTIONS.setDataOk());
      this.#Skins2View.displayContent(CONTENT);
      this.#Skins2View.prepareSlidersData();
      this.mbSlideActions.init();
    },
    onError: () => this.#Skins2View.displayContent(ERROR),
  });

  #chooseMainImage = (index, prevIndex, side) => {
    this.#Skins2View.chooseMainImage(index, prevIndex);
    if (side === X) this.slideActions.chooseSlide(index, true);
    if (side === Y) this.mbSlideActions.chooseMbSlide(index, true);
  };

  #handleSlider = () => {
    let prevIndex = 1; // By default, index of 1 is active
    let currentTranslateY = 0; // 'rem' unit
    let isReadyToDrag = false;
    let startClientY;
    let newClientY;

    const chooseSlide = (index, auto = false) => {
      // 'click' event happens after both 'mousedown' and 'mouseup' event
      currentTranslateY = this.#Skins2View.countTranslateY(index);
      this.#Skins2View.slide(currentTranslateY);
      this.#Skins2View.slideAnimate(index, prevIndex);

      // When choose image using Slider, it automatically choose image using msSlider and vice versa
      // 'auto' parameter is used to prevent infinite loop choosing main image
      // We only want sliders's animation
      if (!auto) this.#chooseMainImage(index, prevIndex, Y);
      prevIndex = index;
    };

    const dragStart = event => {
      isReadyToDrag = true;
      startClientY = event.clientY ?? event.touches[0].clientY;
    };

    const dragProgress = event => {
      if (!isReadyToDrag) return;
      newClientY = event.clientY ?? event.touches[0].clientY;
      const diff = newClientY - startClientY;
      this.#Skins2View.slide(currentTranslateY + diff / REM);
    };

    const adjustCurrentTranslateY = () => {
      const slideItemHeight = this.#Skins2View.getSlideItemHeight() / REM;
      const totalItems = store.state.skins2.skins.length;

      if (currentTranslateY > slideItemHeight) return slideItemHeight;
      if (currentTranslateY < -((totalItems - 2) * slideItemHeight))
        return -((totalItems - 2) * slideItemHeight);
      return Math.round(currentTranslateY / 10) * 10;
    };

    const dragStop = () => {
      if (!isReadyToDrag) return;
      isReadyToDrag = false;
      currentTranslateY += (newClientY - startClientY) / REM;
      currentTranslateY = adjustCurrentTranslateY();
      this.#Skins2View.slide(currentTranslateY);
    };

    return {
      chooseSlide,
      dragStart,
      dragProgress,
      dragStop,
    };
  };

  #handleMbSlider = () => {
    let prevIndex = 1;
    let currentTranslateXDefault; // 'rem' unit
    let currentTranslateX; // 'rem' unit
    let isReadyToDrag = false;
    let startClientX;
    let newClientX;

    const init = () => {
      currentTranslateXDefault = this.#Skins2View.countMbTranslateX(1);
      currentTranslateX = currentTranslateXDefault;
      this.#Skins2View.mbSlide(currentTranslateX);
    };

    const chooseMbSlide = (index, auto = false) => {
      currentTranslateX = this.#Skins2View.countMbTranslateX(index);
      this.#Skins2View.mbSlide(currentTranslateX);
      this.#Skins2View.mbSlideAnimate(index, prevIndex);

      if (!auto) this.#chooseMainImage(index, prevIndex, X);
      prevIndex = index;
    };

    const dragStart = event => {
      isReadyToDrag = true;
      startClientX = event.clientX ?? event.touches[0].clientX;
    };

    const dragProgress = event => {
      if (!isReadyToDrag) return;
      newClientX = event.clientX ?? event.touches[0].clientX;
      const diff = newClientX - startClientX;
      this.#Skins2View.mbSlide(currentTranslateX + diff / REM);
    };

    const adjustCurrentTranslateX = () => {
      const itemWidth = this.#Skins2View.getMbSlideItemWidth() / REM;
      const totalItems = store.state.skins2.skins.length;
      const pointDefault = currentTranslateXDefault + itemWidth; // Default index is 1
      const limitAfter = -(itemWidth * (totalItems - 1) - pointDefault);

      if (currentTranslateX > pointDefault) return pointDefault;
      if (currentTranslateX < limitAfter) return limitAfter;

      const range = currentTranslateX - currentTranslateXDefault;
      const mod = Math.abs(range) % itemWidth;
      if (range < 0) {
        if (mod < itemWidth / 2) return currentTranslateX + mod;
        return currentTranslateX + mod - itemWidth;
      } else {
        if (mod < itemWidth / 2) return currentTranslateX - mod;
        return currentTranslateX - mod + itemWidth;
      }
    };

    const dragStop = () => {
      if (!isReadyToDrag) return;
      isReadyToDrag = false;
      currentTranslateX += (newClientX - startClientX) / REM;
      currentTranslateX = adjustCurrentTranslateX();
      this.#Skins2View.mbSlide(currentTranslateX);
    };

    const resize = () => {
      if (!store.state.skins2.ok) return;
      this.#Skins2View.setMbSliderWidth(); // Keep data in sync in both `controller` and `view`
      currentTranslateXDefault = this.#Skins2View.countMbTranslateX(1);
      currentTranslateX = adjustCurrentTranslateX();
      this.#Skins2View.mbSlide(currentTranslateX);
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
}

export default Skins2Controller;
