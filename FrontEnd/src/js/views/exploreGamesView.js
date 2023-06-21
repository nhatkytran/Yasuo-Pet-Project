import {
  BACKEND_URL,
  START,
  END,
  ADD,
  REMOVE,
  SHOW,
  HIDE,
  INVALID_ACTION_MESSAGE,
  SIDEBAR_ARROW_OPEN,
  SIDEBAR_ARROW_CLOSE,
  FADE_IN,
  FADE_OUT,
  OPEN_SIDEBAR_EVENT,
  NONE,
  LOADING,
  ERROR,
  CONTENT,
  ANIMATION_TIMEOUT_100,
} from '../config';

import {
  $,
  $$,
  $_,
  animateFactory,
  classRemove,
  promisifyLoadingImage,
} from '../utils';

class ExploreGamesView {
  #modal;
  #mainButton;

  #sidebar;
  #sidebarHeader;
  #sidebarCloseButton;

  #posters;
  #bodyState;
  #bodyStateLoading;
  #bodyStateError;
  #loadingErrorButton;

  #animateSidebar;
  #animateSidebarHeader;

  constructor() {
    const classSidebar = '.explore-games';
    const classBody = state => `${classSidebar}__body-${state}`;

    this.#modal = $('#modal');
    this.#mainButton = $('.main-header__games');

    this.#sidebar = $(classSidebar);
    this.#sidebarHeader = $_(this.#sidebar, `${classSidebar}__header`);
    this.#sidebarCloseButton = $_(
      this.#sidebarHeader,
      `${classSidebar}__header-more-close`
    );

    this.#posters = $$(classBody('poster'));
    this.#bodyState = $(classBody('state'));
    this.#bodyStateLoading = $_(this.#bodyState, classBody('state-loading'));
    this.#bodyStateError = $_(this.#bodyState, classBody('state-error'));
    this.#loadingErrorButton = $_(this.#bodyStateError, 'button');

    this.displayContent(NONE);

    this.#animateSidebar = animateFactory(this.#sidebar, {
      start: SIDEBAR_ARROW_OPEN,
      end: SIDEBAR_ARROW_CLOSE,
    });
    this.#animateSidebarHeader = animateFactory(this.#sidebarHeader, {
      start: FADE_IN,
      end: FADE_OUT,
    });
  }

  displayContent(state) {
    classRemove(
      ADD,
      this.#bodyState,
      this.#bodyStateLoading,
      this.#bodyStateError
    );

    const displayPoster = (poster, state) => {
      if (state !== SHOW && state !== HIDE)
        throw new Error(INVALID_ACTION_MESSAGE);

      poster.classList[state === SHOW ? 'remove' : 'add'](HIDE);
    };

    if (state === NONE || state === LOADING || state === ERROR) {
      // Use class `hide` for keeping images to remain thesize of the sidebar
      this.#posters.forEach(poster => {
        // `transition: 'all ease 0.2s';` is set in CSS for better animation \
        // when display content. Use `unset` when close model to get animation
        poster.style.transition = 'unset';
        displayPoster(poster, HIDE);
        // back to first CSS set in CSS file
        poster.style.transition = 'all ease 0.2s';
      });

      if (state === NONE) return;

      classRemove(
        REMOVE,
        this.#bodyState,
        state === LOADING ? this.#bodyStateLoading : this.#bodyStateError
      );
    }

    if (state === CONTENT)
      this.#posters.forEach((poster, index) => {
        setTimeout(() => {
          displayPoster(poster, SHOW);
        }, index * ANIMATION_TIMEOUT_100 - 20); // -20 so it is a little bit faster
      });
  }

  open() {
    classRemove(REMOVE, this.#sidebar);
    this.#animateSidebar(START);
    this.#animateSidebarHeader(START);
  }

  openSidebarSignal() {
    this.#sidebar.dispatchEvent(new CustomEvent(OPEN_SIDEBAR_EVENT));
  }

  close(timeToClose) {
    this.displayContent(NONE);

    this.#animateSidebar(END);
    this.#animateSidebarHeader(END);

    setTimeout(classRemove.bind(null, ADD, this.#sidebar), timeToClose);
  }

  async createPosters(data) {
    const images = $$('.eg-poster-img');
    const promises = [...images].map((image, index) =>
      promisifyLoadingImage(image, `${BACKEND_URL}${data[index].link}`)
    );

    await Promise.all(promises);
  }

  addOpenSidebarHandler(handler) {
    this.#mainButton.addEventListener('click', handler);
  }

  addCloseSidebarHandler(handler) {
    this.#sidebarCloseButton.addEventListener('click', handler);
    this.#modal.addEventListener('click', handler);
  }

  addFetchAndDisplayDataHandler(handler) {
    this.#sidebar.addEventListener(OPEN_SIDEBAR_EVENT, handler);
    this.#loadingErrorButton.addEventListener('click', handler);
  }
}

export default new ExploreGamesView();
