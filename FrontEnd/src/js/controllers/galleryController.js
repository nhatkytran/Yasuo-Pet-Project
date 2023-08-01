import { CONTENT, LOADING, ERROR } from '../config';
import { checkEmptyObject } from '../utils';
import state, { fetchGalleryData } from '../model';

class GalleryController {
  #galleryView;
  #modalActions;
  #warningActions;

  constructor(galleryView, modalActions, warningActions) {
    this.#galleryView = galleryView;
    this.#modalActions = modalActions;
    this.#warningActions = warningActions;
  }

  #fetchData = async () => {
    try {
      this.#galleryView.displayContent(LOADING);

      const data = await fetchGalleryData();

      console.log(data);

      await this.#galleryView.createGallery(data.gallery);

      state.galleryData = data;

      this.#galleryView.prepareData();
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      this.#galleryView.displayContent(ERROR);
    }
  };

  handleData = async () => {
    if (checkEmptyObject(state.galleryData)) await this.#fetchData();
    if (!checkEmptyObject(state.galleryData))
      this.#galleryView.displayContent(CONTENT);
  };

  #handleGalleryChoosen = () => {
    let abortController = null;
    let prevIndex = null;
    let URL;

    const registerWarningAction = () => {
      abortController = new AbortController();

      this.#warningActions.registerAccept(
        abortController,
        () => (window.location.href = URL)
      );
      this.#warningActions.registerDecline(abortController, close);
    };

    const open = index => {
      this.#modalActions.open();
      this.#galleryView.galleryLogo.open(index);

      URL = state.galleryData.gallery[index].link;

      this.#warningActions.handleMessages({
        description: `You are being redirected to [<span style="user-select: all">${URL}</span>]. This is a trusted URL, but not a part of 'Yasuo | The King of All Kings'`,
        buttonMessage: "I know, let's go",
      });
      this.#warningActions.open();

      prevIndex = index;

      registerWarningAction();
    };

    const close = () => {
      this.#modalActions.close();
      this.#galleryView.galleryLogo.close(prevIndex);
      this.#warningActions.close();

      if (abortController !== null) abortController.abort();
      abortController = null;
    };

    return { open, close };
  };

  galleryChoosenActions = this.#handleGalleryChoosen();
}

export default GalleryController;
