import { $, $$ } from '../config.js';

class AllGamesView {
  _parentElement = $('.sb-ag');

  _openButton = $('.main-header__riot-logo');
  _overlay = $('.sb-ag-container');
  _closeButton = $('.sb-ag-header__close');

  _allGamesItems = $$('.sb-ag-body__left-link');
  _agMainPoster = $('.sb-ag-body__right');

  _hovered;
  _timeout;

  constructor() {
    this._allGamesItems.forEach((item, index) => {
      item.setAttribute('data-agi-id', `ag__img--${index + 1}`);
    });
  }

  // Open & Close
  handleOpen() {
    this._overlay.classList.add('show');
  }

  addHandlerOpen(handler) {
    this._openButton.addEventListener('click', function () {
      handler('open');
    });
  }

  handleClose() {
    this._parentElement.classList.add('close-special');

    setTimeout(() => {
      this._parentElement.classList.remove('close-special');
      this._overlay.classList.remove('show');
    }, 250);

    $$('.sb-ag-body__left-title').forEach(item => {
      item.parentElement.classList.remove('show');
    });
  }

  addHandlerClose(handler) {
    this._closeButton.addEventListener('click', function () {
      handler('close');
    });

    this._overlay.addEventListener('click', function (event) {
      if (!event.target.closest('.sb-ag')) handler('close');
    });
  }

  // Function
  _generateMarkup(img, state) {
    // 14: From "Universe with index 14, poster use text instead of png or svg"
    // [1, 7, 9, 10, 13] => png
    const index = +img?.slice(img.length - 2, img.length).replace('-', '') - 1;

    return `
      <div class="sb-ag-body__right--hover">
        <div class="sb-ag-body__right--hover-frame"></div>
        <div class="ag__hover-content" style="${
          state.hoverMarkupBackground[index]
        }">
          <div class="ag__hover-content--child">
            <div class="ag__hover-imgs-cover">
              <img
                class="ag__hover-imgs ${index >= 14 ? 'hide' : ''}"
                src="./src/img/nav-ag/${img}s.${
      [1, 7, 9, 10, 13].indexOf(index + 1) !== -1 ? 'png' : 'svg'
    }"
                alt="${state.hoverMarkupSEO[index]}"
              />
              <span class="ag__hover-imgs--text ${index < 14 ? 'hide' : ''}">${
      state.hoverMarkupSEO[index]
    }</span>
            </div>
            <p class="ag__hover-text">
              ${state.hoverMarkupQuote[index]}
            </p>
            <div class="ag__hover-icon ${
              index === 0 || index === 8 || index >= 10 ? 'hide' : ''
            }">
              <svg
                width="8"
                height="8"
                class="ag__hover-icon--1 ${
                  (index > 0 && index < 5) ||
                  index === 6 ||
                  index === 7 ||
                  index === 9
                    ? 'show'
                    : ''
                }"
                viewBox="0 0 10 10"
              >
                <title>platform_windows_transp</title>
                <path
                  d="M0 1.416L4.087.86l.002 3.929-4.084.023L0 1.416zm4.085 3.827l.003 3.933-4.085-.56V5.218l4.082.026zM4.58.79L9.998 0v4.741l-5.418.042V.79zM10 5.279L9.998 10 4.58 9.238l-.008-3.966L10 5.28z"
                ></path>
              </svg>
              <svg
                width="8"
                height="8"
                class="ag__hover-icon--2 ${
                  index > 2 && index < 7 ? 'show' : ''
                }"
                viewBox="0 0 7 10"
              >
                <title>platform_phone_transp</title>
                <path
                  d="M2.5 8.125a.624.624 0 101.249.001.624.624 0 00-1.249 0zM0 .938v8.125C0 9.58.42 10 .938 10h4.375c.517 0 .937-.42.937-.937V.938A.938.938 0 005.312 0H.938A.938.938 0 000 .938zm.938 8.007v-7.89c0-.065.052-.117.117-.117h4.14c.065 0 .117.052.117.117v7.89a.118.118 0 01-.117.118h-4.14a.118.118 0 01-.117-.118z"
                ></path>
              </svg>
              <svg
                width="8"
                height="8"
                class="ag__hover-icon--3 ${
                  index === 6 || index === 7 || index === 9 ? 'show' : ''
                }"
                viewBox="0 0 11 10"
              >
                <title>platform_switch_transp</title>
                <path
                  d="M3.015.033a2.584 2.584 0 00-2.05 1.884c-.09.35-.097.555-.086 3.27.006 2.492.008 2.55.05 2.742.23 1.038.966 1.777 2.014 2.021.137.031.31.038 1.43.044 1.16.008 1.28.006 1.311-.025.031-.031.033-.43.033-4.961 0-3.358-.006-4.94-.02-4.97C5.676.003 5.64 0 4.427.003c-.985.002-1.281.008-1.412.03zM4.89 5.002v4.195l-.842-.01c-.777-.009-.86-.013-1.015-.052a1.756 1.756 0 01-1.3-1.355c-.046-.209-.046-5.36-.002-5.565A1.778 1.778 0 012.802.933c.273-.11.4-.122 1.286-.124l.801-.002v4.195z"
                  fill="#7E7E7E"
                ></path>
                <path
                  d="M3.193 2.074c-.13.025-.329.124-.434.217-.218.188-.325.456-.309.77a.651.651 0 00.085.34c.097.2.244.348.445.447a.643.643 0 00.354.083c.164.006.222 0 .332-.037.449-.152.72-.588.643-1.036a.951.951 0 00-1.116-.784z"
                  fill="#7E7E7E"
                ></path>
                <path
                  d="M6.726.015c-.009.006-.015 2.25-.015 4.987 0 4.516.002 4.974.033 4.986.056.02 1.663.013 1.862-.008a2.585 2.585 0 002.14-1.729c.131-.39.127-.286.127-3.261 0-2.375-.004-2.729-.033-2.88A2.57 2.57 0 008.732.03C8.587.005 8.363 0 7.642 0c-.496 0-.91.005-.916.014zm2.21 4.51c.324.084.589.33.697.645.068.195.066.48-.002.659a1.022 1.022 0 01-.694.641 1.02 1.02 0 01-1.22-.691 1.187 1.187 0 01.009-.584 1.005 1.005 0 011.21-.67z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
        <img
          class="ag__hover-img"
          src="./src/img/nav-ag/${img}.jpeg"
          alt="${state.hoverMarkupSEO[index]}"
        />
      </div>
    `;
  }

  handleHover(hovered, event, state) {
    if (hovered) {
      clearTimeout(this._timeout);
      $('.sb-ag-body__right--hover')?.remove();

      const img = event.target.closest('.sb-ag-body__left-link').dataset.agiId;

      this._agMainPoster.classList.add('hide');
      this._agMainPoster.insertAdjacentHTML(
        'afterbegin',
        this._generateMarkup(img, state)
      );
    } else {
      this._timeout = setTimeout(() => {
        $('.sb-ag-body__right--hover')?.remove();
        this._agMainPoster.classList.remove('hide');
      }, 200);
    }
  }

  _checkHover(event) {
    return [
      event.target.closest('.sb-ag-body__left-link') ? true : false,
      event,
    ];
  }

  addHandlerFunction(handler) {
    this._overlay.addEventListener('mousemove', event => {
      if (window.innerWidth > 1040) handler(this._checkHover(event));
    });
  }

  // Function mobile
  handleFunctionMobile(item) {
    if (item) item.parentElement.classList.toggle('show');
  }

  addHandlerFunctionMobile(handler) {
    $('.sb-ag-body__left').addEventListener('click', function (event) {
      handler(event.target.closest('.sb-ag-body__left-title'));
    });
  }
}

export default new AllGamesView();
