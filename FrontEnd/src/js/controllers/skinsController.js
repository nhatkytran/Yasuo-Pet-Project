import { CONTENT, LOADING, ERROR, LEFT, RIGHT } from '../config';
import { checkEmptyObject } from '../utils';
import state, { fetchSkinsData } from '../model';

class SkinsController {
  #skinsView;
  #totalSkins;
  #totalSkinsCeil; // Number of slides on the right side (include current slide)
  #totalSkinsFloor; // On the left side

  constructor(skinsView) {
    this.#skinsView = skinsView;
  }

  #fetchData = async () => {
    try {
      this.#skinsView.displayContent(LOADING);

      const data = await fetchSkinsData();

      console.log(data);
      await this.#skinsView.createImages(data.skins);

      state.skinsData = data;
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      this.#skinsView.displayContent(ERROR);
    }
  };

  handleData = async () => {
    return;
    // Skins and Skins2 use the same data, so we one of them needs to fetch data
    if (checkEmptyObject(state.skinsData)) await this.#fetchData();
    if (!checkEmptyObject(state.skinsData))
      this.#skinsView.displayContent(CONTENT);

    this.#totalSkins = this.#skinsView.countImages();
    this.#totalSkinsCeil = Math.ceil(this.#totalSkins / 2);
    this.#totalSkinsFloor = Math.floor(this.#totalSkins / 2);
  };

  handleSlide = () => {
    let currentIndex = 0;
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

      // Logic
      // 3 4 0 1 2 --> Click `right` --> // 3 0 1 2 4
      // So `leftIndex` if affected

      if (side === LEFT) {
        const rightIndex = rightIndices.at(-1);

        options.side = LEFT;
        options.rightIndex = rightIndex;
        prevRightIndex = rightIndex;
      }

      if (side === RIGHT) {
        const leftIndex = leftIndices[0];

        options.side = RIGHT;
        options.leftIndex = leftIndex;
        prevLeftIndex = leftIndex;
      }

      this.#skinsView.handleImagesZIndex(options);
    };

    return (currentIndex, side) => {
      // `side` is `null` --> Adjust position of images for default
      if (side !== null || side !== LEFT || side !== RIGHT)
        throw new Error('Require `side` argument: null | left | right');

      handleImagesZIndex(side);
    };
  };
}

export default SkinsController;
