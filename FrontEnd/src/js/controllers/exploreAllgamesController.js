import { MAIN, SUB } from '../config';

import state, {
  fetchExploreAllgamesData,
  fetchExploreAllgamesDataAbort,
} from '../model';

import SidebarArrowController from './sidebarArrowController';

class ExploreAllgamesController extends SidebarArrowController {
  constructor(exploreAllgamesView) {
    super(exploreAllgamesView);
  }

  close = handleCloseModal =>
    super.close(handleCloseModal, fetchExploreAllgamesDataAbort);

  #fetchDataCallback = async () => {
    const { images, ...posterOptions } = await fetchExploreAllgamesData();

    await Promise.all([
      super.instanceView.createMainImages(images.main),
      super.instanceView.createPosters(images.side, posterOptions),
    ]);
  };

  handleData = async () => {
    super.handleData(
      state.isExploreAllgamesFetchData,
      state.setExploreAllgamesFetchData,
      this.#fetchDataCallback
    );
  };

  selectPosters = state => {
    if (state === MAIN) super.instanceView.displayMainImages();
    if (state === SUB) super.instanceView.displayPosters();
  };

  toggleLinks = linkTitle => super.instanceView.toggleLinks(linkTitle);
}

export default ExploreAllgamesController;
