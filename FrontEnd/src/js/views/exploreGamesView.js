import { REMOVE, OPEN_SIDEBAR_EVENT, START } from '../config';
import { $, $_, classRemove } from '../helpers';
import { animateFactory } from '../utils';

class ExploreGamesView {
  #modal;
  #mainButton;

  #sidebar;
  #sidebarHeader;
  #sidebarCloseButton;

  #animateSidebar;
  #animateSidebarHeader;

  constructor() {
    this.#modal = $('#modal');
    this.#mainButton = $('.main-header__games');

    this.#sidebar = $('.explore-games');
    this.#sidebarHeader = $_(this.#sidebar, '.explore-games__header');
    this.#sidebarCloseButton = $_(
      this.#sidebarHeader,
      '.explore-games__header-more-close'
    );

    this.#animateSidebar = animateFactory(this.#sidebar, {
      start: 'sidebar-arrow-open',
      end: 'sidebar-arrow-close',
    });
    this.#animateSidebarHeader = animateFactory(this.#sidebarHeader, {
      start: 'fade-in',
      end: 'fade-out',
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

  addOpenSidebarHandler(handler) {
    this.#mainButton.addEventListener('click', handler);
  }

  addFetchAndDisplayDataHandler(handler) {
    this.#sidebar.addEventListener(OPEN_SIDEBAR_EVENT, () => {
      console.log('Start!');
    });
  }
}

export default new ExploreGamesView();
