import { ANIMATION_TIMEOUT, NONE, LOADING, ERROR, CONTENT } from '../config';
import { catchAsync, checkAbortError } from '../utils';

import store from '../models/store';
import allgamesService from '../models/features/allgames/allgamesService';
import { ACTIONS } from '../models/features/allgames/reducer';

import ModalContentController from './modalContentController';

const filename = 'exploreAllgamesController';

class ExploreAllgamesController extends ModalContentController {
  #AllgamesView;

  constructor(AllgamesView) {
    super();
    this.#AllgamesView = AllgamesView;
  }

  open = handleOpenModal => {
    super.open(handleOpenModal, this.#AllgamesView.open);
    setTimeout(this.#AllgamesView.openSidebarSignal, ANIMATION_TIMEOUT);
  };

  close = handleCloseModal => {
    allgamesService.getDataAbort();
    super.close(handleCloseModal, this.#AllgamesView.close);
  };

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      if (!store.state.allgames.ok) {
        this.#AllgamesView.displayContent(LOADING);

        await allgamesService.getData('/api/v1/allGames/data'); // Fixname
        const { images, ...posterOptions } = store.state.allgames;

        await Promise.all([
          this.#AllgamesView.createMainImages(images.main),
          this.#AllgamesView.createPosters(images.side, posterOptions),
        ]);

        store.dispatch(ACTIONS.setDataOk());
      }

      console.log(store.state);
      this.#AllgamesView.displayContent(CONTENT);
    },
    onError: error => {
      // Abort error happens when close modal
      // Display content to none to hide Error message because modal closes anyway
      if (checkAbortError(error)) this.#AllgamesView.displayContent(NONE);
      else this.#AllgamesView.displayContent(ERROR);
    },
  });

  selectPosters = state => this.#AllgamesView.selectPosters(state);
  toggleLinks = linkTitle => this.#AllgamesView.toggleLinks(linkTitle);
}

export default ExploreAllgamesController;
