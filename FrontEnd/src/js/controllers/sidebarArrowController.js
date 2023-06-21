import { ANIMATION_TIMEOUT, NONE, LOADING, ERROR, CONTENT } from '../config';
import { checkAbortError } from '../utils';

class SidebarArrowController {
  #instanceView;

  #sidebarIsOpening;
  #sidebarIsClosing;

  constructor(instanceView) {
    this.#instanceView = instanceView;
  }

  get instanceView() {
    return this.#instanceView;
  }

  // Why getter?
  // Help Child Class access to method via `super`
  // For example: super.open()

  get open() {
    return handleOpenModal => {
      if (this.#sidebarIsOpening || this.#sidebarIsClosing) return;

      handleOpenModal();

      this.#sidebarIsOpening = true;
      this.#instanceView.open();

      setTimeout(() => {
        this.#sidebarIsOpening = false;
        this.#instanceView.openSidebarSignal();
      }, ANIMATION_TIMEOUT);
    };
  }

  get close() {
    return (handleCloseModal, fetchAbort) => {
      if (this.#sidebarIsOpening || this.#sidebarIsClosing) return;

      fetchAbort();
      handleCloseModal();

      this.#sidebarIsClosing = true;
      this.#instanceView.close(ANIMATION_TIMEOUT);

      setTimeout(() => {
        this.#sidebarIsClosing = false;
      }, ANIMATION_TIMEOUT);
    };
  }

  #fetchData = async (setIsFetched, fetchDataCallback) => {
    try {
      this.#instanceView.displayContent(LOADING);

      await fetchDataCallback();

      // Only need to know we fetched data or not
      // createMainImages and createPosters do all the things like inject data into HTML
      setIsFetched(true);
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      this.#instanceView.displayContent(ERROR);

      // Abort error happens when close modal
      // Display content to none to hide Error message because modal closes anyway
      if (checkAbortError(error)) this.#instanceView.displayContent(NONE);
    }
  };

  get handleData() {
    return async (isFetched, setIsFetched, fetchDataCallback) => {
      // If error happends, #fetchData will take care of desplaying error
      if (!isFetched()) await this.#fetchData(setIsFetched, fetchDataCallback);
      if (isFetched()) this.#instanceView.displayContent(CONTENT);
    };
  }
}

export default SidebarArrowController;
