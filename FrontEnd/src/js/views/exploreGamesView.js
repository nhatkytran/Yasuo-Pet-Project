import {
  BACKEND_URL,
  START,
  END,
  ADD,
  REMOVE,
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

const classBody = state => `.explore-games__body-${state}`;

class ExploreGamesView {
  #modal = $('#modal');
  #mainButton = $('.main-header__games');

  #sidebar = $('.explore-games');
  #sidebarHeader = $_(this.#sidebar, `.explore-games__header`);
  #sidebarCloseButton = $_(
    this.#sidebarHeader,
    `.explore-games__header-more-close`
  );

  #posters = $$(classBody('poster'));
  #bodyState = $(classBody('state'));
  #bodyStateLoading = $_(this.#bodyState, classBody('state-loading'));
  #bodyStateError = $_(this.#bodyState, classBody('state-error'));
  #loadingErrorButton = $_(this.#bodyStateError, 'button');

  #animateSidebar;
  #animateSidebarHeader;

  constructor() {
    this.#animateSidebar = animateFactory(this.#sidebar, {
      start: SIDEBAR_ARROW_OPEN,
      end: SIDEBAR_ARROW_CLOSE,
    });
    this.#animateSidebarHeader = animateFactory(this.#sidebarHeader, {
      start: FADE_IN,
      end: FADE_OUT,
    });

    this.displayContent(NONE);
  }

  displayContent(state) {
    this.#sidebar.classList.remove('stop-overflow');
    classRemove(
      ADD,
      this.#bodyState,
      this.#bodyStateLoading,
      this.#bodyStateError
    );

    // Use class `hide` for keeping images to remain thesize of the sidebar
    this.#posters.forEach(poster => {
      // `transition: 'all ease 0.2s';` is set in CSS for better animation
      // when display content. Use `unset` when close model to get animation
      poster.style.transition = 'unset';
      poster.classList.add('hide');
      // back to first CSS set in CSS file
      poster.style.transition = 'all ease 0.2s';
    });

    if (state === LOADING || state === ERROR) {
      this.#sidebar.classList.add('stop-overflow');
      classRemove(
        REMOVE,
        this.#bodyState,
        state === LOADING ? this.#bodyStateLoading : this.#bodyStateError
      );
    }

    if (state === CONTENT)
      this.#posters.forEach(
        (poster, index) =>
          setTimeout(
            () => poster.classList.remove('hide'),
            index * ANIMATION_TIMEOUT_100 - 20
          ) // -20 so it is a little bit faster
      );
  }

  open = () => {
    classRemove(REMOVE, this.#sidebar);
    this.#animateSidebar(START);
    this.#animateSidebarHeader(START);
  };

  openSidebarSignal = () =>
    this.#sidebar.dispatchEvent(new CustomEvent(OPEN_SIDEBAR_EVENT));

  close = timeToClose => {
    this.displayContent(NONE);
    this.#animateSidebar(END);
    this.#animateSidebarHeader(END);
    setTimeout(classRemove.bind(null, ADD, this.#sidebar), timeToClose);
  };

  async createPosters(data) {
    const images = $$('.eg-poster-img');
    const promises = [...images].map((image, index) =>
      promisifyLoadingImage(image, `${BACKEND_URL}${data[index].link}`)
    );

    await Promise.all(promises);
  }

  //
  // Events listening //////////

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
