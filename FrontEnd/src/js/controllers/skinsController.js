import { CONTENT, LOADING, ERROR, LEFT, RIGHT } from '../config';
import { catchAsync, sideIndices } from '../utils';

import store from '../models/store';
import skinsService from '../models/features/skins/skinsService';
import { ACTIONS } from '../models/features/skins/reducer';

const filename = 'skinsController.js';

class SkinsController {
  #SkinsView;
  #totalSkins;
  #totalSkinsCeil; // Right side (include current slide)
  #totalSkinsFloor; // Left side
  #currentIndex = 0;

  constructor(SkinsView) {
    this.#SkinsView = SkinsView;
  }

  #prepareSlideData = () => {
    this.#totalSkins = this.#SkinsView.countImages();
    this.#totalSkinsCeil = Math.ceil(this.#totalSkins / 2);
    this.#totalSkinsFloor = Math.floor(this.#totalSkins / 2);
    this.handleSlide(null);
  };

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      if (!store.state.skins.ok) {
        this.#SkinsView.displayContent(LOADING);

        await skinsService.getData('/api/v1/skins/data');
        await this.#SkinsView.createImages(store.state.skins.skins);

        store.dispatch(ACTIONS.setDataOk());
        this.#prepareSlideData();
      }

      this.#SkinsView.displayContent(CONTENT);
    },
    onError: () => this.#SkinsView.displayContent(ERROR),
  });

  handleSlide = this.handleSlideFactory();
  handleSlideFactory() {
    let rightIndices = [];
    let leftIndices = [];
    let prevRightIndex = null;
    let prevLeftIndex = null;

    // Handle z-index-1-neg (this is just the name of a class `_utils.scss`)
    // When translateX, the last image can precede and take up the current view
    // So, we need to set z-index = -1 for the last image (base on left or right)
    // With each called, we remove previous setting z-index
    const handleImagesZIndex = side => {
      if (side === null) return;

      const options = { prevLeftIndex, prevRightIndex };
      let optionsAdition = {};

      // The first time run with `side` is null --> fill `leftIndices` and `rightIndices`
      // 3 4 [0] 1 2 --> Right --> // 4 0 [1] 2 3

      if (side === RIGHT) {
        const leftIndex = leftIndices[0];
        optionsAdition = { leftIndex };
        prevLeftIndex = leftIndex;
      }
      if (side === LEFT) {
        const rightIndex = rightIndices.at(-1);
        optionsAdition = { rightIndex };
        prevRightIndex = rightIndex;
      }

      this.#SkinsView.animateImageZIndex({ ...options, ...optionsAdition });
    };

    const handleImagesIndices = () => {
      // [0, 1, 2, 3, 4, 5, 6, 7]
      rightIndices = Array.from(
        { length: this.#totalSkinsCeil },
        sideIndices(this.#currentIndex, this.#totalSkins)
      );

      // [8, 9, 10, 11, 12, 13, 14]
      leftIndices = Array.from(
        { length: this.#totalSkinsFloor },
        sideIndices(this.#currentIndex, this.#totalSkins, this.#totalSkinsFloor)
      );
    };

    const handleImagesTransformX = () => {
      rightIndices.forEach((rightIndex, index) =>
        this.#SkinsView.imageTranslateX(rightIndex, index * 100)
      );

      // Reverse to calculate translateX easier
      [...leftIndices].reverse().forEach((leftIndex, index) =>
        // index -->  0  1  2 --> reverse() --> 2 1 0 --> -3 -2 -1
        this.#SkinsView.imageTranslateX(leftIndex, (-index - 1) * 100)
      );
    };

    const handleTitleBoard = () => {
      const skins = store.state.skins.skins[this.#currentIndex];
      this.#SkinsView.titleBoard({
        name: skins.name,
        price: skins.price,
        monetaryUnit: '$',
        order: this.#currentIndex + 1,
        total: this.#totalSkins,
      });
    };

    const handleLogoDingdong = () => this.#SkinsView.headerLogoDingdong();
    const handleExploreMobileDingdong = () =>
      this.#SkinsView.exploreMobileDingdong();

    return side => {
      // `side` is `null` --> Adjust position of images for default
      if (side !== null && side !== LEFT && side !== RIGHT)
        throw new Error('Require `side` argument: null | left | right');

      if (side === LEFT) {
        this.#currentIndex -= 1;
        if (this.#currentIndex < 0) this.#currentIndex = this.#totalSkins - 1;
      }
      if (side === RIGHT) {
        this.#currentIndex += 1;
        if (this.#currentIndex === this.#totalSkins) this.#currentIndex = 0;
      }

      handleImagesZIndex(side); // if `side` is `null` --> return
      handleImagesIndices();
      handleImagesTransformX();
      handleTitleBoard();
      handleLogoDingdong();
      handleExploreMobileDingdong();
    };
  }

  exploreSkins = () => {
    alert(`Buy skin --> ${this.#currentIndex}`);
  };
}

export default SkinsController;
