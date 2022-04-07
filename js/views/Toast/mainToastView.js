import { $ } from '../../config.js';

class MainToastView {
  _render(data, type) {
    const markup = this._generateMarkup(data[type]);

    $('#toast').insertAdjacentHTML('beforeend', markup);
  }

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

  handleToast(data, type) {
    this._render(data, type);

    setTimeout(() => {
      $('#toast').removeChild($('#toast').firstElementChild);
    }, 3000);
  }

  addToastHandler(handler) {
    // window.addEventListener('load', function () {
    //   handler();
    // });
    $('.trailer__content-button').addEventListener('click', function () {
      handler('welcome');
    });

    $('.trailer__content-img').addEventListener('click', function () {
      handler('information');
    });
  }

  _clear(element) {
    $('#toast').removeChild(element);
  }

  handleClearToast(target) {
    this._clear(target);
  }

  addClearToastHandler(handler) {
    $('#toast').addEventListener('click', function (event) {
      const target = event.target.closest('.toast');

      if (target) {
        handler(target);
      }
    });
  }
}

export default new MainToastView();
