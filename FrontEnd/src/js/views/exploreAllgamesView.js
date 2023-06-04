import { $ } from '../helpers';

class ExploreAllgamesView {
  #mainHeader = $('.main-header');
  #sidebar = $('.sb-ag');

  #openSidebarNameEvent = 'openSidebarEvent';

  openSidebarSignal() {
    this.#sidebar.dispatchEvent(new CustomEvent(this.#openSidebarNameEvent));
  }

  addOpenSidebarHandler(handler) {
    this.#mainHeader.addEventListener('click', event => {
      if (event.target.closest('.main-header__riot')) handler();
    });
  }
}

export default new ExploreAllgamesView();
