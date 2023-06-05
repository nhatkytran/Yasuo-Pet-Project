import {
  ADD,
  REMOVE,
  NONE,
  LOADING,
  ERROR,
  CONTENT,
  LEFT,
  RIGHT,
} from '../config';
import { $, $_, classRemove } from '../helpers';

class ExploreAllgamesView {
  #modal;
  #mainHeader;

  #sidebar;
  #sidebarHeader;
  #sidebarCloseButton;

  #leftBody;
  #rightBody;
  #leftLoading;
  #leftLoadingProcess;
  #leftLoadingError;
  #rightLoading;
  #rightLoadingProcess;
  #rightLoadingError;
  #loadingErrorButton;

  #openSidebarNameEvent;

  constructor() {
    const classBody = side => `.sb-ag-body__${side}`;
    const classLoading = side => `.sb-ag-body__${side}-loading`;
    const classLoadingProcess = side => `.sb-ag-body__${side}-loading-inner`;
    const classLoadingError = side => `.sb-ag-body__${side}-loading-error`;

    this.#modal = $('#modal');
    this.#mainHeader = $('.main-header');

    this.#sidebar = $('.sb-ag');
    this.#sidebarHeader = $_(this.#sidebar, '.sb-ag-header');
    this.#sidebarCloseButton = $_(this.#sidebarHeader, '.sb-ag-header__close');

    this.#leftBody = $(classBody(LEFT));
    this.#rightBody = $(classBody(RIGHT));

    this.#leftLoading = $(classLoading(LEFT));
    this.#leftLoadingProcess = $_(this.#leftLoading, classLoadingProcess(LEFT));
    this.#leftLoadingError = $_(this.#leftLoading, classLoadingError(LEFT));

    this.#rightLoading = $(classLoading(RIGHT));
    this.#rightLoadingProcess = $_(
      this.#rightLoading,
      classLoadingProcess(RIGHT)
    );
    this.#rightLoadingError = $_(this.#rightLoading, classLoadingError(RIGHT));

    this.#loadingErrorButton = $_(this.#leftLoadingError, 'button');

    this.#openSidebarNameEvent = 'openSidebarEvent';
  }

  #animateSidebar(state) {
    if (state === ADD) {
      this.#sidebar.classList.remove('sidebar-arrow-close');
      this.#sidebar.classList.add('sidebar-arrow-open');
    }
    if (state === REMOVE) {
      this.#sidebar.classList.remove('sidebar-arrow-open');
      this.#sidebar.classList.add('sidebar-arrow-close');
    }
  }

  #animateSidebarHeader(state) {
    if (state === ADD) this.#sidebarHeader.classList.add('fade-in');
    if (state === REMOVE) this.#sidebarHeader.classList.remove('fade-in');
  }

  #displayContent(state) {
    if (state === NONE)
      classRemove(
        ADD,
        this.#leftBody,
        this.#rightBody,
        this.#leftLoading,
        this.#rightLoading
      );
  }

  open() {
    this.#sidebar.classList.remove('remove');
    this.#animateSidebar(ADD);
    this.#animateSidebarHeader(ADD);
  }

  close(timeToClose) {
    this.#displayContent(NONE);

    // Abort fetching

    // Closing animation
    this.#animateSidebar(REMOVE);
    this.#animateSidebarHeader(REMOVE);

    // Close
    setTimeout(() => {
      this.#sidebar.classList.add('remove');
    }, timeToClose);
  }

  openSidebarSignal() {
    this.#sidebar.dispatchEvent(new CustomEvent(this.#openSidebarNameEvent));
  }

  addOpenSidebarHandler(handler) {
    this.#mainHeader.addEventListener('click', event => {
      if (event.target.closest('.main-header__riot')) handler();
    });
  }

  addCloseSidebarHandler(handler) {
    this.#sidebarCloseButton.addEventListener('click', handler);
    this.#modal.addEventListener('click', handler);
  }
}

export default new ExploreAllgamesView();
