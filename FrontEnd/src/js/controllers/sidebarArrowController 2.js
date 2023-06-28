import { ANIMATION_TIMEOUT } from '../config';

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

  open = handleOpenModal => {
    if (this.#sidebarIsOpening || this.#sidebarIsClosing) return;

    handleOpenModal();

    this.#sidebarIsOpening = true;
    this.#instanceView.open();

    setTimeout(() => {
      this.#sidebarIsOpening = false;
      this.#instanceView.openSidebarSignal();
    }, ANIMATION_TIMEOUT);
  };

  get close() {
    return this.#close;
  }

  #close = (handleCloseModal, fetchAbort) => {
    if (this.#sidebarIsOpening || this.#sidebarIsClosing) return;

    fetchAbort();
    handleCloseModal();

    this.#sidebarIsClosing = true;
    this.#instanceView.close(ANIMATION_TIMEOUT);

    setTimeout(() => {
      this.#sidebarIsClosing = false;
    }, ANIMATION_TIMEOUT);
  };

  close2 = (handleCloseModal, fetchAbort) => {
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

export default SidebarArrowController;
