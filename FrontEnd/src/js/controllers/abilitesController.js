import { CONTENT, LOADING, ERROR } from '../config';
import { checkAbortError } from '../utils';
import state, { fetchAbilitiesData, fetchAbilitiesDataAbort } from '../model';

class AbilitiesController {
  #abilitiesView;
  #lastSkillIndex;

  constructor(abilitiesView) {
    this.#abilitiesView = abilitiesView;
  }

  chooseSkill = index => {
    this.#abilitiesView.markSkillChosen(index, this.#lastSkillIndex);

    if (!state.isAbilitiesFetchData) {
      fetchAbilitiesDataAbort();
      this.handleData();
    } else {
      this.#abilitiesView.markDescriptionChosen(index, this.#lastSkillIndex);
    }

    this.#lastSkillIndex = index;
  };

  #fetchData = async () => {
    try {
      this.#abilitiesView.displayContent(LOADING);

      const { videos, descriptions } = await fetchAbilitiesData();

      // await this.#abilitiesView.createVideos(videos);
      this.#abilitiesView.createDescriptions(
        descriptions,
        this.#lastSkillIndex
      );

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
    if (state.isAbilitiesFetchData) this.#abilitiesView.displayContent(CONTENT);
  };
}

export default AbilitiesController;
