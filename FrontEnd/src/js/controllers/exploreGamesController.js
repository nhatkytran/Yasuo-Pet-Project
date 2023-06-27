import { ANIMATION_TIMEOUT, NONE, LOADING, ERROR, CONTENT } from '../config';
import { checkAbortError } from '../utils';

import state, {
  fetchExploreGamesData,
  fetchExploreGamesDataAbort,
} from '../model';

import ModalContentController from './modalContentController';

class ExploreGamesController extends ModalContentController {
  #exploreGamesView;

  constructor(exploreGamesView) {
    super();
    this.#exploreGamesView = exploreGamesView;
  }

  open = handleOpenModal => {
    if (super.open(handleOpenModal, this.#exploreGamesView.open))
      setTimeout(this.#exploreGamesView.openSidebarSignal, ANIMATION_TIMEOUT);
  };

  close = handleCloseModal => {
    if (super.close(handleCloseModal, this.#exploreGamesView.close)) {
      fetchExploreGamesDataAbort();
    }
  };

  #fetchData = async () => {
    try {
      this.#exploreGamesView.displayContent(LOADING);

      const { images } = await fetchExploreGamesData();
      await this.#exploreGamesView.createPosters(images);

      // Only need to know we fetched data or not
      // createMainImages and createPosters do all the things like inject data into HTML
      state.isExploreGamesFetchData = true;
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      this.#exploreGamesView.displayContent(ERROR);

      // Abort error happens when close modal
      // Display content to none to hide Error message because modal closes anyway
      if (checkAbortError(error)) this.#exploreGamesView.displayContent(NONE);
    }
  };

  handleData = async () => {
    if (!state.isExploreGamesFetchData) await this.#fetchData();
    if (state.isExploreGamesFetchData)
      this.#exploreGamesView.displayContent(CONTENT);
  };
}

export default ExploreGamesController;
