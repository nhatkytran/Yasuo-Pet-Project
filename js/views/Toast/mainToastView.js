import { $, $$ } from '../../config.js';

class MainToastView {
  _parentElement = $('#toast');
  _sectionToasts = $$('.section');
  _interval = null;
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

  _reRender() {
    $$('.toast').forEach((item, index) => {
      item.style.transform = `translateY(${index * 9.4}rem)`;
    });
  }

  _autoClear() {
    if (!this._interval) {
      this._interval = setInterval(() => {
        if (this._parentElement.firstElementChild) {
          this._parentElement.removeChild(
            this._parentElement.firstElementChild
          );
          this._reRender();
        } else {
          clearInterval(this._interval);
          this._interval = null;
        }
      }, this._timeClearToast);
    }
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
    clearInterval(this._interval);
    this._interval = null;
    this._autoClear();
  }

  addClearToastHandler(handler) {
    $('#toast').addEventListener('click', function (event) {
      const target = event.target.closest('.toast');

      if (target) {
        handler(target);
      }
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
}

export default new MainToastView();
