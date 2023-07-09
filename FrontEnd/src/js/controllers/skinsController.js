import { CONTENT, LOADING, ERROR } from '../config';
import { checkEmptyObject } from '../utils';
import state, { fetchSkinsData } from '../model';

class SkinsController {
  #skinsView;

  constructor(skinsView) {
    this.#skinsView = skinsView;
  }

  #fetchData = async () => {
    try {
      this.#skinsView.displayContent(LOADING);

      const data = await fetchSkinsData();

      console.log(data);

      // await this.#skinsView.createImages(data.images);

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
  };
}

export default SkinsController;
