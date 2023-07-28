import { CONTENT, LOADING, ERROR } from '../config';
import { checkEmptyObject } from '../utils';
import state, { fetchRuinedData } from '../model';

class RuinedController {
  #ruinedView;

  constructor(ruinedView) {
    this.#ruinedView = ruinedView;
  }

  #fetchData = async () => {
    try {
      this.#ruinedView.displayContent(LOADING);

      const data = await fetchRuinedData();

      await this.#ruinedView.createImages(data.images);

      state.ruinedData = data;
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      this.#ruinedView.displayContent(ERROR);
    }
  };

  handleData = async () => {
    if (checkEmptyObject(state.ruinedData)) await this.#fetchData();
    if (!checkEmptyObject(state.ruinedData))
      this.#ruinedView.displayContent(CONTENT);
  };
}

export default RuinedController;
