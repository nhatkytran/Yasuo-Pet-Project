import { CONTENT, LOADING, ERROR } from '../config';
import { checkEmptyObject } from '../utils';
import state, { fetchSkinsData } from '../model';

class Skins2Controller {
  #skins2View;
  #totalSkins; // Counted after fetching data

  constructor(skins2View) {
    this.#skins2View = skins2View;
  }

  #fetchData = async () => {
    try {
      this.#skins2View.displayContent(LOADING);

      const data = await fetchSkinsData();

      console.log(data);

      await this.#skins2View.createImages(data.skins);
      await this.#skins2View.createSlider(data.skins);
      await this.#skins2View.createMbSlider(data.skins);

      state.skinsData = data;
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

    this.#totalSkins = state.skinsData.skins.length;

    console.log(this.#totalSkins);
  };
}

export default Skins2Controller;
