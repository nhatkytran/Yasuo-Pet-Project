import { CONTENT, LOADING, ERROR, REM } from '../config';
import { checkEmptyObject } from '../utils';
import state, { fetchSkinsData } from '../model';

class Skins2Controller {
  #skins2View;

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
  };

  #handleSlider = () => {
    let prevIndex = 1; // By default, index of 1 is active
    let currentTranslateY = 0; // `rem` unit
    let isDragged = false;
    let isReadyToDrag = false;
    let startClientY;
    let newClientY;

    const chooseSlide = (index, slideItemHeight) => {
      if (isDragged) return;

      currentTranslateY = ((index - 1) * -slideItemHeight) / 10;

      this.#skins2View.slide(currentTranslateY);
      this.#skins2View.slideAnimate(index, prevIndex);

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

    const dragStop = () => {
      isReadyToDrag = false;

      if (!isDragged) return;
      isDragged = false; // `click` event before `mouseup` event

      currentTranslateY += (newClientY - startClientY) / REM;

      const slideItemHeight = this.#skins2View.getSlideItemHeight() / REM;
      const totalItems = state.skinsData.skins.length;

      if (currentTranslateY > slideItemHeight)
        currentTranslateY = slideItemHeight;
      if (currentTranslateY < -(totalItems - 2) * slideItemHeight)
        currentTranslateY = -(totalItems - 2) * slideItemHeight;

      currentTranslateY = Math.round(currentTranslateY / 10) * 10;

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
}

export default Skins2Controller;
