import { LOADING, ERROR, CONTENT, SHOW, HIDE } from '../config';
import { catchAsync, checkAbortError } from '../utils';

import store from '../models/store';
import abilitiesService from '../models/features/abilities/abilitiesService';
import { ACTIONS } from '../models/features/abilities/reducer';

const filename = 'abilitiesController.js';

class AbilitiesController {
  #AbilitiesView;
  #lastSkillIndex;

  constructor(AbilitiesView) {
    this.#AbilitiesView = AbilitiesView;
  }

  chooseSkill = index => {
    this.#AbilitiesView.displayPlayVideoButton(HIDE);
    this.#AbilitiesView.markSkillChosen(index, this.#lastSkillIndex);

    if (!store.state.abilities.ok) {
      abilitiesService.getDataAbort();
      this.handleData(index);
    } else {
      this.#AbilitiesView.markDescriptionChosen(index, this.#lastSkillIndex);
      this.#AbilitiesView.markVideoChosen(index, this.#lastSkillIndex);
      this.#AbilitiesView.controlVideoChosen(index, this.#lastSkillIndex);
    }

    this.#lastSkillIndex = index;
  };

  handleData = catchAsync({
    filename,
    onProcess: async index => {
      this.#AbilitiesView.displayContent(LOADING);

      await abilitiesService.getData('/api/v1/abilities/data');

      const { videos, descriptions } = store.state.abilities;
      await this.#AbilitiesView.createVideos(videos, index);
      this.#AbilitiesView.createDescriptions(descriptions, index);

      store.dispatch(ACTIONS.setDataOk());
      this.#AbilitiesView.displayContent(CONTENT);
      this.#AbilitiesView.displayPlayVideoButton(SHOW);
    },
    onError: error => {
      if (!checkAbortError(error)) this.#AbilitiesView.displayContent(ERROR);
    },
  });

  playVideoFirstTime = () => {
    this.#AbilitiesView.displayPlayVideoButton(HIDE);
    this.#AbilitiesView.controlVideoChosen(this.#lastSkillIndex);
  };
}

export default AbilitiesController;
