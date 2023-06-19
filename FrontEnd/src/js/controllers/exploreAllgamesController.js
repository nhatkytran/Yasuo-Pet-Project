import {
  ANIMATION_TIMEOUT,
  NONE,
  LOADING,
  ERROR,
  CONTENT,
  MAIN,
  SUB,
} from '../config';

import { checkAbortError } from '../helpers';

import state, {
  fetchExploreAllgamesData,
  fetchExploreAllgamesDataAbort,
} from '../model';

class ExploreAllgamesController {
  #exploreAllgamesView;

  #sidebarIsOpening;
  #sidebarIsClosing;

  constructor(exploreAllgamesView) {
    this.#exploreAllgamesView = exploreAllgamesView;
  }

  open = handleOpenModal => {
    if (this.#sidebarIsOpening || this.#sidebarIsClosing) return;

    handleOpenModal();

    this.#sidebarIsOpening = true;
    this.#exploreAllgamesView.open();

    setTimeout(() => {
      this.#sidebarIsOpening = false;
      this.#exploreAllgamesView.openSidebarSignal();
    }, ANIMATION_TIMEOUT);
  };

  close = async handleCloseModal => {
    if (this.#sidebarIsOpening || this.#sidebarIsClosing) return;

    fetchExploreAllgamesDataAbort();
    handleCloseModal();

    this.#sidebarIsClosing = true;
    this.#exploreAllgamesView.close(ANIMATION_TIMEOUT);

    setTimeout(() => {
      this.#sidebarIsClosing = false;
    }, ANIMATION_TIMEOUT);
  };

  #fetchData = async () => {
    try {
      this.#exploreAllgamesView.displayContent(LOADING);

      const { images, ...posterOptions } = await fetchExploreAllgamesData();

      await Promise.all([
        this.#exploreAllgamesView.createMainImages(images.main),
        this.#exploreAllgamesView.createPosters(images.side, posterOptions),
      ]);

      // Only need to know we fetched data or not
      // createMainImages and createPosters do all the things like inject data into HTML
      state.isExploreAllgamesFetchData = true;
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      this.#exploreAllgamesView.displayContent(ERROR);

      // Abort error happens when close modal
      // Display content to none to hide Error message because modal closes anyway
      if (checkAbortError(error))
        this.#exploreAllgamesView.displayContent(NONE);
    }
  };

  handleData = async () => {
    // If error happends, #fetchData will take care of desplaying error
    if (!state.isExploreAllgamesFetchData) await this.#fetchData();
    if (state.isExploreAllgamesFetchData)
      this.#exploreAllgamesView.displayContent(CONTENT);
  };

  selectPosters = state => {
    if (state === MAIN) this.#exploreAllgamesView.displayMainImages();
    if (state === SUB) this.#exploreAllgamesView.displayPosters();
  };

  toggleLinks = linkTitle => this.#exploreAllgamesView.toggleLinks(linkTitle);
}

export default ExploreAllgamesController;
