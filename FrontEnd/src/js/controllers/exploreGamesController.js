import { ANIMATION_TIMEOUT, NONE, LOADING, ERROR, CONTENT } from '../config';
import { checkAbortError } from '../utils';

import state, {
  fetchExploreGamesData,
  fetchExploreGamesDataAbort,
} from '../model';

import ModalContentController from './modalContentController';

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
    super.close(handleCloseModal, this.#GamesView.close);
    fetchExploreGamesDataAbort();
  };

  #fetchData = async () => {
    try {
      this.#GamesView.displayContent(LOADING);

      const { images } = await fetchExploreGamesData();
      await this.#GamesView.createPosters(images);

      // Only need to know we fetched data or not
      // createMainImages and createPosters do all the things like inject data into HTML
      state.isExploreGamesFetchData = true;
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      this.#GamesView.displayContent(ERROR);

      // Abort error happens when close modal
      // Display content to none to hide Error message because modal closes anyway
      if (checkAbortError(error)) this.#GamesView.displayContent(NONE);
    }
  };

  handleData = async () => {
    if (!state.isExploreGamesFetchData) await this.#fetchData();
    if (state.isExploreGamesFetchData) this.#GamesView.displayContent(CONTENT);
  };
}

export default ExploreGamesController;
