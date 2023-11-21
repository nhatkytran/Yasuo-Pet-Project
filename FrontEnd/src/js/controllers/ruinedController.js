import { CONTENT, LOADING, ERROR } from '../config';
import { catchAsync } from '../utils';

import store from '../models/store';
import ruinedService from '../models/features/ruined/ruinedService';
import { ACTIONS } from '../models/features/ruined/reducer';

const filename = 'ruinedController.js';

class RuinedController {
  #RuinedView;

  constructor(RuinedView) {
    this.#RuinedView = RuinedView;
  }

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      this.#RuinedView.displayContent(LOADING);

      await ruinedService.getData('/api/v1/ruined/data');
      await this.#RuinedView.createImages(store.state.ruined.images);

      store.dispatch(ACTIONS.setDataOk());
      this.#RuinedView.displayContent(CONTENT);
    },
    onError: () => {
      this.#RuinedView.displayContent(ERROR);
    },
  });
}

export default RuinedController;
