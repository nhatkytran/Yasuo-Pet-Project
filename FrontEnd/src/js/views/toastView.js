import { CLEAR_TOAST_TIMEOUT } from '../config';
import { $, $$ } from '../utils';

class ToastView {
  #toastWrapper = $('#toast');

  #generateToastMarkup = ({ type, title, content }) => `
    <div class="toast toast-${type}">
      <div class="toast-overlay"></div>
      <div class="toast-content">
        <div class="toast-content__main">
          <h1 class="toast-content__main-title">${title}</h1>
          <p class="toast-content__main-content">${content}</p>
        </div>
        <svg class="toast-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z">
          </path>
        </svg>
      </div>
    </div>
  `;

  #arrageToasts = () =>
    $$('.toast').forEach(
      (item, index) => (item.style.transform = `translateY(${index * 9.4}rem)`)
    );

  ceateToast = data => {
    const markup = this.#generateToastMarkup(data);
    this.#toastWrapper.insertAdjacentHTML('beforeend', markup);
    this.#arrageToasts();
    const element = [...$$('.toast')].at(-1);
    setTimeout(() => this.clear(element), CLEAR_TOAST_TIMEOUT);
  };

  clear = element => {
    if (this.#toastWrapper.contains(element)) {
      this.#toastWrapper.removeChild(element);
      this.#arrageToasts();
    }
  };

  // _autoClear() {
  //   setTimeout(() => {
  //     if (this._parentElement.firstElementChild) {
  //       this._parentElement.removeChild(this._parentElement.firstElementChild);
  //       this._reRender();
  //     }
  //   }, this._timeClearToast);
  // }

  // _clear(element) {
  //   this._parentElement.removeChild(element);
  // }

  // handleToast(data, type) {
  //   this._render(data, type);
  //   this._reRender();
  //   this._autoClear();
  // }

  // handleClearToast(target) {
  //   this._clear(target);
  //   this._reRender();
  // }

  //
  // Events listening //////////

  addClearToastHandler(handler) {
    this.#toastWrapper.addEventListener('click', event => {
      if (!event.target.closest('.toast-close')) return;
      handler(event.target.closest('.toast'));
    });
  }

  addTest() {
    $('.trailer__content-img').addEventListener('click', () => {
      this.ceateToast({
        type: 'welcome',
        title: 'Welcome!',
        content: 'My first project. Have fun exploring things.',
      });
    });
  }

  // Apply //
  // Initial load
  // addToastHandler(handler) {
  //   window.addEventListener('load', function () {
  //     handler('welcome');
  //   });
  // }

  // class 'section' is observed
  // _sectionToastsCallback = function (handler, entries, observer) {
  //   const [entry] = entries;

  //   if (entry.isIntersecting) {
  //     handler(entry.target.dataset.section);
  //     observer.unobserve(entry.target);
  //   }
  // };

  // addObserverToastHandler(handler) {
  //   const observer = new IntersectionObserver(
  //     this._sectionToastsCallback.bind(null, handler),
  //     {
  //       root: null,
  //       threshold: 0.5,
  //     }
  //   );

  //   this._sectionToasts.forEach(item => {
  //     observer.observe(item);
  //   });
  // }
}

export default new ToastView();
