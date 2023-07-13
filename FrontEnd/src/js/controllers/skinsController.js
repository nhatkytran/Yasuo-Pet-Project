import { CONTENT, LOADING, ERROR, LEFT, RIGHT } from '../config';
import { checkEmptyObject } from '../utils';
import state, { fetchSkinsData } from '../model';

class SkinsController {
  #skinsView;
  #totalSkins;
  #totalSkinsCeil; // Number of slides on the right side (include current slide)
  #totalSkinsFloor; // On the left side
  #currentIndex; // Initialized by handleSlideFactory;

  constructor(skinsView) {
    this.#skinsView = skinsView;
  }

  #fetchData = async () => {
    try {
      this.#skinsView.displayContent(LOADING);

      const data = await fetchSkinsData();

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
    // Skins and Skins2 use the same data, so we one of them needs to fetch data
    if (checkEmptyObject(state.skinsData)) await this.#fetchData();
    if (!checkEmptyObject(state.skinsData))
      this.#skinsView.displayContent(CONTENT);

    // After render images to view, prepare date to slide
    this.#totalSkins = this.#skinsView.countImages();
    this.#totalSkinsCeil = Math.ceil(this.#totalSkins / 2);
    this.#totalSkinsFloor = Math.floor(this.#totalSkins / 2);

    this.handleSlide(null);
  };

  handleSlide = this.handleSlideFactory();
  handleSlideFactory() {
    this.#currentIndex = 0;

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
        // The first time run with `side` is null --> fill `leftIndices` and `rightIndices`
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

      this.#skinsView.animateImageZIndex(options);
    };

    const handleImagesIndices = () => {
      // Find indices on the left side
      leftIndices = Array(this.#totalSkinsFloor)
        .fill(null)
        .map((_, index) => {
          let shouldIndex =
            this.#currentIndex +
            index +
            this.#totalSkins -
            this.#totalSkinsFloor;

          if (shouldIndex >= length) shouldIndex %= this.#totalSkins;

          return shouldIndex;
        });

      // Find indices on the right side
      rightIndices = Array(this.#totalSkinsCeil)
        .fill(null)
        .map((_, index) => {
          let shouldIndex = this.#currentIndex + index;
          if (shouldIndex >= length) shouldIndex %= this.#totalSkins;

          return shouldIndex;
        });
    };

    const handleImagesTransformX = () => {
      // Control translateX - Left
      // Reverse to calculate translateX easier
      [...leftIndices].reverse().forEach((leftIndex, index) =>
        // index -->  0  1  2
        // index --> -3 -2 -1
        this.#skinsView.imageTranslateX(leftIndex, (-index - 1) * 100)
      );

      // Control translateX - Right
      rightIndices.forEach((rightIndex, index) =>
        this.#skinsView.imageTranslateX(rightIndex, index * 100)
      );
    };

    const handleTitleBoard = index => {
      const skins = state.skinsData.skins[index];

      this.#skinsView.titleBoardName(skins.name);
      this.#skinsView.titleBoardPrice(skins.price, '$');
      this.#skinsView.titleBoardOrder(index + 1, this.#totalSkins);
    };

    const handleLogoDingdong = () => {
      this.#skinsView.headerLogoDingdong();
    };

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
      handleTitleBoard(this.#currentIndex);
      handleLogoDingdong();
    };
  }

  buySkinsQuestion = () => {
    alert('Click `EXPLORE button` to view details and buy skin');
  };

  exploreSkins = () => {
    alert(`Buy skin --> ${this.#currentIndex}`);
  };
}

export default SkinsController;
