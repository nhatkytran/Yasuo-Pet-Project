import { $, $$ } from '../../config.js';

class MainToastView {
  _parentElement = $('#toast');
  _sectionToasts = $$('.section');
  _timeClearToast = 5000;

  _generateMarkup({ type, title, content }) {
    return `
      <div class="toast">
        <div class="toast-overlay ${type}"></div>
        <div class="toast-content">
          <div class="toast-content__left ${type}"></div>
          <div class="toast-content__center">
            <h1 class="toast-content__center-title">${title}</h1>
            <p class="toast-content__center-content">
              ${content}
            </p>
          </div>
          <div class="toast-content__right">
            <svg
              class="toast-content__right-icon ${type}"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    `;
  }

  _render(data, type) {
    this._parentElement.insertAdjacentHTML(
      'beforeend',
      this._generateMarkup(data[type])
    );
  }

  // Help toasts place reasonably
  _reRender() {
    $$('.toast').forEach((item, index) => {
      item.style.transform = `translateY(${index * 9.4}rem)`;
    });
  }

  _autoClear() {
    setTimeout(() => {
      if (this._parentElement.firstElementChild) {
        this._parentElement.removeChild(this._parentElement.firstElementChild);
        this._reRender();
      }
    }, this._timeClearToast);
  }

  _clear(element) {
    this._parentElement.removeChild(element);
  }

  handleToast(data, type) {
    this._render(data, type);
    this._reRender();
    this._autoClear();
  }

  handleClearToast(target) {
    this._clear(target);
    this._reRender();
  }

  addClearToastHandler(handler) {
    $('#toast').addEventListener('click', function (event) {
      if (!event.target.closest('.toast-content__right-icon')) return;

      handler(event.target.closest('.toast'));
    });
  }

  // Apply //
  // Initial load
  addToastHandler(handler) {
    window.addEventListener('load', function () {
      handler('welcome');
    });
  }

  // class 'section' is observed
  _sectionToastsCallback = function (handler, entries, observer) {
    const [entry] = entries;

    if (entry.isIntersecting) {
      handler(entry.target.dataset.section);
      observer.unobserve(entry.target);
    }
  };

  addObserverToastHandler(handler) {
    const observer = new IntersectionObserver(
      this._sectionToastsCallback.bind(null, handler),
      {
        root: null,
        threshold: 0.3,
      }
    );

    this._sectionToasts.forEach(item => {
      observer.observe(item);
    });
  }

  // Have no function //
  // This new section will be improved later
  // 1. Play for free button (Explore game)
  playForFree(handler) {
    $('.trailer__content-button').addEventListener('click', function () {
      handler('oopsie');
    });
  }

  mainHeaderButton(handler) {
    $('.main-header__play').addEventListener('click', function (event) {
      if (!event.target.closest('.main-header__play-sign')) return;

      handler('oopsie');
    });
  }

  championButton(handler) {
    $('.champion-list').addEventListener('click', function () {
      handler('oopsie');
    });
  }

  exploreSkinsButton(handler) {
    $('.skins_overlay__about-explore-btn').addEventListener(
      'click',
      function () {
        handler('oopsie');
      }
    );
  }

  downloadButtons(handler) {
    $('.footer__1-content--3').addEventListener('click', function (event) {
      if (!event.target.closest('.footer__1-content--3-icon')) return;

      handler('oopsie');
    });
  }

  footer2(handler) {
    $('.footer__2').addEventListener('click', function (event) {
      if (event.target.closest('.footer__2-content-link')) {
        event.preventDefault();

        handler('oopsie');
      }
    });
  }

  footer3Social(handler) {
    $('.footer__3-social').addEventListener('click', function (event) {
      if (event.target.closest('.footer__3-social-link')) {
        event.preventDefault();

        handler('oopsie');
      }
    });
  }

  footer3Privacy(handler) {
    $('.footer__3-privacy').addEventListener('click', function (event) {
      if (event.target.closest('.footer__3-privacy-link')) {
        event.preventDefault();

        handler('oopsie');
      }
    });
  }

  allGamesLeft(handler) {
    $('.sb-ag-body__left').addEventListener('click', function (event) {
      if (event.target.closest('.sb-ag-body__left-link')) {
        event.preventDefault();

        handler('oopsie');
      }
    });
  }

  // allGamesRight(handler) {
  //   $('.sb-ag-body__right').addEventListener('click', function (event) {
  //     if (event.target.closest('.sb-ag-body__right-cover')) {
  //       handler('oopsie');
  //     }
  //   });
  // }
}

export default new MainToastView();
