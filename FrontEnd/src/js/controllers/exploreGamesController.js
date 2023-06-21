import state, {
  fetchExploreGamesData,
  fetchExploreGamesDataAbort,
} from '../model';

import SidebarArrowController from './sidebarArrowController';

class ExploreGamesController extends SidebarArrowController {
  constructor(exploreGamesView) {
    super(exploreGamesView);
  }

  close = handleCloseModal =>
    super.close(handleCloseModal, fetchExploreGamesDataAbort);

  #fetchDataCallback = async () => {
    const { images } = await fetchExploreGamesData();
    await super.instanceView.createPosters(images);
  };

  handleData = async () => {
    super.handleData(
      state.isExploreGamesFetchData,
      state.setExploreGamesFetchData,
      this.#fetchDataCallback
    );
  };
}

export default ExploreGamesController;
