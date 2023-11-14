import { NONE, LOADING, ERROR, CONTENT } from '../config';
import { catchAsync, checkAbortError } from '../utils';

import store from '../models/store';
import gamesService from '../models/features/games/gamesService';
import { ACTIONS } from '../models/features/games/reducer';

import ModalContentController from './modalContentController';

const filename = 'exploreGamesController.js';

class ExploreGamesController extends ModalContentController {
  #GamesView;

  constructor(GamesView) {
    super();
    this.#GamesView = GamesView;
  }

  open = handleOpenModal => {
    const timeToOpen = super.open(handleOpenModal, this.#GamesView.open);
    setTimeout(this.#GamesView.openSidebarSignal, timeToOpen);
  };

  close = handleCloseModal => {
    gamesService.getDataAbort();
    super.close(handleCloseModal, this.#GamesView.close);
  };

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      if (!store.state.games.ok) {
        this.#GamesView.displayContent(LOADING);

        await gamesService.getData('/api/v1/exploreGames/data');

        const { images } = await store.state.games;
        await this.#GamesView.createPosters(images);

        store.dispatch(ACTIONS.setDataOk());
      }

      this.#GamesView.displayContent(CONTENT);
    },
    onError: error => {
      // Abort error happens when close modal
      // Display content to none to hide Error message because modal closes anyway
      if (checkAbortError(error)) this.#GamesView.displayContent(NONE);
      else this.#GamesView.displayContent(ERROR);
    },
  });
}

export default ExploreGamesController;
