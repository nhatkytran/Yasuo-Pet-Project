import { CLEAR_TOAST_TIMEOUT } from '../config';
import { $, $$ } from '../utils';

class ToastView {
  #toastWrapper = $('#toast');

  #generateToastMarkup = ({ type, title, content }, isToastLoading) => `
    <div class="toast toast-${type} ${isToastLoading && 'loading'}">
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

  createToast = (data, isToastLoading) => {
    const markup = this.#generateToastMarkup(data, isToastLoading);
    this.#toastWrapper.insertAdjacentHTML('beforeend', markup);
    this.#arrageToasts();
    const toasts = [...$$('.toast')];
    const element = toasts[toasts.length - 1];
    setTimeout(() => this.clear(element), CLEAR_TOAST_TIMEOUT);
  };

  clear = element => {
    if (this.#toastWrapper.contains(element)) {
      this.#toastWrapper.removeChild(element);
      this.#arrageToasts();
    }
  };

  //
  // Events listening //////////

  addClearToastHandler(handler) {
    this.#toastWrapper.addEventListener('click', event => {
      if (!event.target.closest('.toast-close')) return;
      handler(event.target.closest('.toast'));
    });
  }
}

export default new ToastView();
