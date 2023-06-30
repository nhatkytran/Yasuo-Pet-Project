import { CONTENT, LOADING, ERROR } from '../config';
import state, { fetchAbilitiesData, fetchAbilitiesDataAbort } from '../model';

class AbilitiesController {
  #abilitiesView;
  #lastSkillIndex;

  constructor(abilitiesView) {
    this.#abilitiesView = abilitiesView;
  }

  chooseSkill = index => {
    this.#abilitiesView.markSkillChosen(index, this.#lastSkillIndex);
    this.#lastSkillIndex = index;

    // fetchAbilitiesDataAbort();
  };

  #fetchData = async () => {
    try {
      this.#abilitiesView.displayContent(CONTENT);

      // Only need to know we fetched data or not

      // Fix // createMainImages and createPosters do all the things like inject data into HTML

      state.isAbilitiesFetchData = true;
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      // No need to have abort --> Check lastSkillIndex
      if (!checkAbortError(error)) this.#abilitiesView.displayContent(ERROR);
    }
  };

  handleData = async () => {
    if (!state.isAbilitiesFetchData) await this.#fetchData();
    if (state.isAbilitiesFetchData) console.log('Display data!');
  };
}

export default AbilitiesController;
