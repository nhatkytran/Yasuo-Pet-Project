import { CONTENT, LOADING, ERROR, REM, X, Y } from '../config';
import { catchAsync, checkEmptyObject } from '../utils';

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
  }

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      if (!store.state.skins2.ok) {
        this.#Skins2View.displayContent(LOADING);

        await skins2Service.getData('/api/v1/skins/data');

        const { skins } = store.state.skins2;
        await Promise.all([
          this.#Skins2View.createImages(skins),
          this.#Skins2View.createSlider(skins),
          this.#Skins2View.createMbSlider(skins),
        ]);

        store.dispatch(ACTIONS.setDataOk());
        this.#Skins2View.prepareSlidersData();
      }
    },
    onError: () => this.#Skins2View.displayContent(ERROR),
  });

  #fetchData = async () => {
    try {
      if (!store) this.#Skins2View.displayContent(LOADING);

      const data = await fetchSkinsData();

      await Promise.all([
        this.#Skins2View.createImages(data.skins),
        this.#Skins2View.createSlider(data.skins),
        this.#Skins2View.createMbSlider(data.skins),
      ]);

      state.skinsData = data;

      this.#Skins2View.prepareDataForSliders();
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      this.#Skins2View.displayContent(ERROR);
    }
  };

  handleData2 = async () => {
    // Skins and Skins2 use the same data, so only one of them needs to fetch data
    if (checkEmptyObject(state.skinsData)) await this.#fetchData();
    if (!checkEmptyObject(state.skinsData))
      this.#Skins2View.displayContent(CONTENT);

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

      currentTranslateY = this.#Skins2View.countTranslateY(index);

      this.#Skins2View.slide(currentTranslateY);
      this.#Skins2View.slideAnimate(index, prevIndex);

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
      if (diff !== 0) this.#Skins2View.slide(currentTranslateY + diff / REM);
    };

    const adjustCurrentTranslateX = () => {
      const slideItemHeight = this.#Skins2View.getSlideItemHeight() / REM;
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

      this.#Skins2View.slide(currentTranslateY);
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
      currentTranslateXDefault = this.#Skins2View.countMbTranslateX(1);
      currentTranslateX = currentTranslateXDefault;
      this.#Skins2View.mbSlide(currentTranslateX);
    };

    const chooseMbSlide = (index, auto = false) => {
      if (isDragged) return;

      currentTranslateX = this.#Skins2View.countMbTranslateX(index);

      this.#Skins2View.mbSlide(currentTranslateX);
      this.#Skins2View.mbSlideAnimate(index, prevIndex);

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
      if (diff !== 0) this.#Skins2View.mbSlide(currentTranslateX + diff / REM);
    };

    const adjustCurrentTranslateX = () => {
      const totalItems = state.skinsData.skins.length;
      const itemWidth = this.#Skins2View.getMbSlideItemWidth() / REM;

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

      this.#Skins2View.mbSlide(currentTranslateX);
    };

    const resize = () => {
      this.#Skins2View.setMbSliderWidth(); // Keep data in sync in both `controller` and `view`
      currentTranslateXDefault = this.#Skins2View.countMbTranslateX(1);

      adjustCurrentTranslateX();
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

  mbSlideActions = this.#handleMbSlider();

  #chooseMainImage = (index, prevIndex, side) => {
    this.#Skins2View.chooseMainImage(index, prevIndex);

    if (side === X) this.slideActions.chooseSlide(index, true);
    if (side === Y) this.mbSlideActions.chooseMbSlide(index, true);
  };
}

export default Skins2Controller;
