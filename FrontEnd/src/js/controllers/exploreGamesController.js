import { ANIMATION_TIMEOUT, NONE, LOADING, ERROR, CONTENT } from '../config';
import { checkAbortError } from '../utils';

import state, {
  fetchExploreGamesData,
  fetchExploreGamesDataAbort,
} from '../model';

class ExploreGamesController {
  #exploreGamesView;

  #sidebarIsOpening;
  #sidebarIsClosing;

  constructor(exploreGamesView) {
    this.#exploreGamesView = exploreGamesView;
  }

  open = handleOpenModal => {
    if (this.#sidebarIsOpening || this.#sidebarIsClosing) return;

    handleOpenModal();

    this.#sidebarIsOpening = true;
    this.#exploreGamesView.open();

    setTimeout(() => {
      this.#sidebarIsOpening = false;
      this.#exploreGamesView.openSidebarSignal();
    }, ANIMATION_TIMEOUT);
  };

  close = handleCloseModal => {
    if (this.#sidebarIsOpening || this.#sidebarIsClosing) return;

    fetchExploreGamesDataAbort();
    handleCloseModal();

    this.#sidebarIsClosing = true;
    this.#exploreGamesView.close(ANIMATION_TIMEOUT);

    setTimeout(() => {
      this.#sidebarIsClosing = false;
    }, ANIMATION_TIMEOUT);
  };

  #fetchData = async () => {
    try {
      this.#exploreGamesView.displayContent(LOADING);

      const { images } = await fetchExploreGamesData();

      await this.#exploreGamesView.createPosters(images);

      state.isExploreAllgamesFetchData = true;
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
    // If error happends, #fetchData will take care of desplaying error
    if (!state.isExploreAllgamesFetchData) await this.#fetchData();
    if (state.isExploreAllgamesFetchData)
      this.#exploreGamesView.displayContent(CONTENT);
  };
}

export default ExploreGamesController;
