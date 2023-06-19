import { ANIMATION_TIMEOUT } from '../config';

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
}

export default ExploreGamesController;
