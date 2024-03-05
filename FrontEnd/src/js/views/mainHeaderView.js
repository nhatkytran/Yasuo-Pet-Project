import { ADD, REMOVE } from '../config';
import { $, $$, classRemove } from '../utils';

class MainHeaderView {
  #subHeaderContainer = $('header.container');
  #mainHeaderIllusion = $('.main-header__illusion');
  #mainHeader = $('.main-header__cover');
  #aboutButtonsContainer = $('.main-header-about__list');
  #aboutButtonClass = '.main-header-about__link';

  toggleSticky = isSticky => {
    classRemove(isSticky ? REMOVE : ADD, this.#mainHeaderIllusion);
    this.#mainHeader.classList[isSticky ? ADD : REMOVE]('sticky');
  };

  scrollToSection = section => {
    const sectionTop = $(`#${section}`).getBoundingClientRect().top;
    const more = section === 'section-abilities' ? 50 : 0;
    const mainHeaderHight = 70;

    window.scrollTo({
      top: window.scrollY + sectionTop - mainHeaderHight - more,
      behavior: 'smooth',
    });
  };

  //
  // Events listening //////////

  addIntersectionObserver(handler) {
    const observer = new IntersectionObserver(
      entries => handler(!entries[0].isIntersecting),
      { root: null, threshold: 0 }
    );

    observer.observe(this.#subHeaderContainer);
  }

  addSurfSections(handler) {
    this.#aboutButtonsContainer.addEventListener('click', event => {
      const target = event.target.closest(this.#aboutButtonClass);

      if (!target) return;
      event.preventDefault();

      const { section } = target.dataset;
      if (section) handler(section);
    });
  }
}

export default new MainHeaderView();
