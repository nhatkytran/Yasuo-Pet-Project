import { CONTENT, LOADING, ERROR } from '../config';
import { checkEmptyObject } from '../utils';
import state, { fetchGalleryData } from '../model';

class GalleryController {
  #galleryView;

  constructor(galleryView) {
    this.#galleryView = galleryView;
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

  #handleGalleryChoosen = (modalActions, warningActions) => {
    let abortController = null;

    const open = () => {};

    const close = () => {};

    return { open, close };
  };

  galleryChoosenActions = this.#handleGalleryChoosen();

  #abortController = null;

  handleCloseImageChosen = (modalActions, warningActions) => {
    modalActions.handleCloseModal();

    this.#galleryView.closeGalleryLogo();

    warningActions.handleMessages({});
    warningActions.close();

    if (this.#abortController !== null) this.#abortController.abort();
    this.#abortController = null;
  };

  handleChooseImage = (modalActions, warningActions, index) => {
    modalActions.handleOpenModal();

    this.#galleryView.openGalleryLogo(index);

    const URL = state.galleryData.gallery[index].link;

    warningActions.handleMessages({
      description: `You are being redirected to [<span style="user-select: all">${URL}</span>]. This is the trusted URL, but not a part of 'Yasuo | The King of All Kings'`,
      buttonMessage: "I know, let's go",
    });
    warningActions.open();

    this.#abortController = new AbortController();

    warningActions.registerAccept(this.#abortController, () => {
      window.location.href = URL;
    });
    warningActions.registerReject(
      this.handleCloseImageChosen.bind(this, modalActions, warningActions)
    );
  };
}

export default GalleryController;
