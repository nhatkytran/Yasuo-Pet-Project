import {
  BACKEND_URL,
  ANIMATION_TIMEOUT,
  ADD,
  REMOVE,
  OPEN_SIDEBAR_EVENT,
  NONE,
  LOADING,
  ERROR,
  CONTENT,
  SKELETON_LOADING_INTERVAL,
  LEFT,
  RIGHT,
  MAIN,
  SUB,
} from '../config';

import {
  $,
  $$,
  $_,
  $$_,
  classRemove,
  promisifyLoadingImage,
  mapMarkup,
} from '../helpers';

class ExploreAllgamesView {
  #modal;
  #mainButton;

  #sidebar;
  #sidebarHeader;
  #sidebarCloseButton;

  #leftBody;
  #rightBody;
  #leftLoading;
  #leftLoadingProcess;
  #leftLoadingError;
  #rightLoading;
  #rightLoadingProcess;
  #rightLoadingError;
  #loadingErrorButton;
  #loadingBars;

  #posterLinksClass;
  #posterLinks;
  #posterContainer;

  #linkTitlesClass;
  #linkTitles;

  constructor() {
    const classBody = side => `.sb-ag-body__${side}`;
    const classLoading = side => `.sb-ag-body__${side}-loading`;
    const classLoadingProcess = side => `.sb-ag-body__${side}-loading-inner`;
    const classLoadingError = side => `.sb-ag-body__${side}-loading-error`;

    this.#modal = $('#modal');
    this.#mainButton = $('.main-header__riot');

    this.#sidebar = $('.sb-ag');
    this.#sidebarHeader = $_(this.#sidebar, '.sb-ag-header');
    this.#sidebarCloseButton = $_(this.#sidebarHeader, '.sb-ag-header__close');

    this.#leftBody = $(classBody(LEFT));
    this.#rightBody = $(classBody(RIGHT));

    this.#leftLoading = $(classLoading(LEFT));
    this.#leftLoadingProcess = $_(this.#leftLoading, classLoadingProcess(LEFT));
    this.#leftLoadingError = $_(this.#leftLoading, classLoadingError(LEFT));

    this.#rightLoading = $(classLoading(RIGHT));
    this.#rightLoadingProcess = $_(
      this.#rightLoading,
      classLoadingProcess(RIGHT)
    );
    this.#rightLoadingError = $_(this.#rightLoading, classLoadingError(RIGHT));

    this.#loadingErrorButton = $_(this.#leftLoadingError, 'button');
    this.#loadingBars = $$(`${classLoading(LEFT)} span`);

    this.#posterLinksClass = 'sb-ag-body__left-link';
    this.#posterLinks = $$(`.${this.#posterLinksClass}`);
    this.#posterContainer = $('.ag-poster-container');

    this.#linkTitlesClass = 'sb-ag-body__left-cover';
    this.#linkTitles = $$(`.${this.#linkTitlesClass}`);
  }

  #animateSidebar(state) {
    if (state === ADD) {
      this.#sidebar.classList.remove('sidebar-arrow-close');
      this.#sidebar.classList.add('sidebar-arrow-open');
    }
    if (state === REMOVE) {
      this.#sidebar.classList.remove('sidebar-arrow-open');
      this.#sidebar.classList.add('sidebar-arrow-close');
    }
  }

  #animateSidebarHeader(state) {
    if (state === ADD) this.#sidebarHeader.classList.add('fade-in');
    if (state === REMOVE) this.#sidebarHeader.classList.remove('fade-in');
  }

  #skeletonLoading() {
    this.#loadingBars.forEach(bar => {
      const randomWidth = Math.random() * 100;
      const randomHeight = Math.random() * 2;
      const width = randomWidth >= 20 ? randomWidth : 20;
      const height = randomHeight >= 1 ? randomHeight : 1;

      bar.style.width = `${width}%`;
      bar.style.height = `${height}rem`;
    });
  }

  #animateLoading = this.#animateLoadingFactory(SKELETON_LOADING_INTERVAL);
  #animateLoadingFactory(intervalTime) {
    let timeoutID;
    let intervalID;

    const start = () => {
      timeoutID = setTimeout(() => {
        this.#skeletonLoading();
      }, ANIMATION_TIMEOUT * 2);

      intervalID = setInterval(() => {
        this.#skeletonLoading();
      }, intervalTime);
    };

    const end = () => {
      if (timeoutID) clearTimeout(timeoutID);
      if (intervalID) clearInterval(intervalID);
    };

    return { start, end };
  }

  displayContent(state) {
    this.#animateLoading.end();

    if (state === NONE) {
      classRemove(
        ADD,
        this.#leftBody,
        this.#rightBody,
        this.#leftLoading,
        this.#rightLoading,
        this.#posterContainer
      );
    }

    if (state === LOADING || state === ERROR) {
      classRemove(ADD, this.#leftBody, this.#rightBody);
      classRemove(REMOVE, this.#leftLoading, this.#rightLoading);

      if (state === LOADING) this.#animateLoading.start();

      classRemove(
        state === LOADING ? REMOVE : ADD,
        this.#leftLoadingProcess,
        this.#rightLoadingProcess
      );
      classRemove(
        state === LOADING ? ADD : REMOVE,
        this.#leftLoadingError,
        this.#rightLoadingError
      );
    }

    if (state === CONTENT) {
      classRemove(ADD, this.#leftLoading, this.#rightLoading);
      classRemove(REMOVE, this.#leftBody, this.#rightBody);
    }
  }

  open() {
    classRemove(REMOVE, this.#sidebar);
    this.#animateSidebar(ADD);
    this.#animateSidebarHeader(ADD);
  }

  openSidebarSignal() {
    this.#sidebar.dispatchEvent(new CustomEvent(OPEN_SIDEBAR_EVENT));
  }

  close(timeToClose) {
    // Close links
    // (< 1040px --> select to see links, so we need to close)
    this.#closeLinks();

    // Remove all to close
    this.displayContent(NONE);

    // Closing animation
    this.#animateSidebar(REMOVE);
    this.#animateSidebarHeader(REMOVE);

    // Close
    setTimeout(classRemove.bind(null, ADD, this.#sidebar), timeToClose);
  }

  async createMainImages(images) {
    const imageEls = $$_(this.#rightBody, '.sb-ag-body__right-img');
    const promises = [...imageEls].map((image, index) =>
      promisifyLoadingImage(image, `${BACKEND_URL}${images[index].link}`)
    );

    await Promise.all(promises);
  }

  #generateImageText = (isImage, content) =>
    isImage
      ? `<img class="ag-poster__header-image" src="" alt=${content} />`
      : `<span class="ag-poster__header-label">${content}</span>`;

  #generatePlatforms = platforms => {
    const windowPlatform = platforms.includes('window')
      ? `
          <svg width="8" height="8" viewBox="0 0 10 10">
            <title>window</title>
            <path
              d="M0 1.416L4.087.86l.002 3.929-4.084.023L0 1.416zm4.085 3.827l.003 3.933-4.085-.56V5.218l4.082.026zM4.58.79L9.998 0v4.741l-5.418.042V.79zM10 5.279L9.998 10 4.58 9.238l-.008-3.966L10 5.28z">
            </path>
          </svg>
        `
      : '';

    const phonePlatform = platforms.includes('phone')
      ? `
          <svg width="8" height="8" viewBox="0 0 7 10">
            <title>phone</title>
            <path
              d="M2.5 8.125a.624.624 0 101.249.001.624.624 0 00-1.249 0zM0 .938v8.125C0 9.58.42 10 .938 10h4.375c.517 0 .937-.42.937-.937V.938A.938.938 0 005.312 0H.938A.938.938 0 000 .938zm.938 8.007v-7.89c0-.065.052-.117.117-.117h4.14c.065 0 .117.052.117.117v7.89a.118.118 0 01-.117.118h-4.14a.118.118 0 01-.117-.118z">
            </path>
          </svg>
        `
      : '';

    const switchPlatform = platforms.includes('switch')
      ? `
          <svg width="8" height="8" viewBox="0 0 11 10">
            <title>switch</title>
            <path
              d="M3.015.033a2.584 2.584 0 00-2.05 1.884c-.09.35-.097.555-.086 3.27.006 2.492.008 2.55.05 2.742.23 1.038.966 1.777 2.014 2.021.137.031.31.038 1.43.044 1.16.008 1.28.006 1.311-.025.031-.031.033-.43.033-4.961 0-3.358-.006-4.94-.02-4.97C5.676.003 5.64 0 4.427.003c-.985.002-1.281.008-1.412.03zM4.89 5.002v4.195l-.842-.01c-.777-.009-.86-.013-1.015-.052a1.756 1.756 0 01-1.3-1.355c-.046-.209-.046-5.36-.002-5.565A1.778 1.778 0 012.802.933c.273-.11.4-.122 1.286-.124l.801-.002v4.195z"
              fill="#7E7E7E"></path>
            <path
              d="M3.193 2.074c-.13.025-.329.124-.434.217-.218.188-.325.456-.309.77a.651.651 0 00.085.34c.097.2.244.348.445.447a.643.643 0 00.354.083c.164.006.222 0 .332-.037.449-.152.72-.588.643-1.036a.951.951 0 00-1.116-.784z"
              fill="#7E7E7E"></path>
            <path
              d="M6.726.015c-.009.006-.015 2.25-.015 4.987 0 4.516.002 4.974.033 4.986.056.02 1.663.013 1.862-.008a2.585 2.585 0 002.14-1.729c.131-.39.127-.286.127-3.261 0-2.375-.004-2.729-.033-2.88A2.57 2.57 0 008.732.03C8.587.005 8.363 0 7.642 0c-.496 0-.91.005-.916.014zm2.21 4.51c.324.084.589.33.697.645.068.195.066.48-.002.659a1.022 1.022 0 01-.694.641 1.02 1.02 0 01-1.22-.691 1.187 1.187 0 01.009-.584 1.005 1.005 0 011.21-.67z">
            </path>
          </svg>
        `
      : '';

    return `${windowPlatform}${phonePlatform}${switchPlatform}`;
  };

  #generatePosterMarkup = (smallImages, posterOptions) => {
    const { colors, descriptions, image_alts, platforms } = posterOptions;

    const markupCallback = (image, index) => `
      <div class="ag-poster ag-poster--${index + 1}">
        <img class="ag-poster__image" src="" alt="${image_alts[index]}">
        <div class="ag-poster__background" style="${colors.bg[index]}">
          <div class="ag-poster__content">
            <div class="ag-poster__header">
              ${this.#generateImageText(
                image.type !== 'text',
                image_alts[index]
              )}
            </div>
            <p class="ag-poster__description">${descriptions[index]}</p>
            ${
              platforms[index].length
                ? `
                    <div class="ag-poster__platform">
                      ${this.#generatePlatforms(platforms[index])}
                    </div>
                  `
                : ''
            }
          </div>
        </div>
      </div>
    `;

    return mapMarkup(smallImages, markupCallback);
  };

  #createPosterImages = async (images, ...imageEls) => {
    const promises = imageEls.map((image, index) =>
      promisifyLoadingImage(image, `${BACKEND_URL}${images[index].link}`)
    );

    await Promise.all(promises);
  };

  #createPosterLargeImages = async largeImages =>
    await this.#createPosterImages(largeImages, ...$$('.ag-poster__image'));

  #createPosterSmallImages = async smallImages =>
    await this.#createPosterImages(
      smallImages.filter(image => image.type !== 'text'),
      ...$$('.ag-poster__header-image')
    );

  async createPosters(images, posterOptions) {
    const posterContainer = $('.ag-poster-container');
    const markup = this.#generatePosterMarkup(images.smalls, posterOptions);

    // Create poster's structure
    posterContainer.insertAdjacentHTML('afterbegin', markup);

    // Add poster's image
    // Each poster has its large image
    // Not every poster has samll image, some of the have title (title is added along with structure)
    await Promise.all([
      this.#createPosterLargeImages(images.larges),
      this.#createPosterSmallImages(images.smalls),
    ]);
  }

  displayMainImages() {
    classRemove(ADD, this.#posterContainer);
    classRemove(REMOVE, this.#rightBody);
  }

  displayPosters() {
    classRemove(ADD, this.#rightBody);
    classRemove(REMOVE, this.#posterContainer);
  }

  #closeLinks() {
    this.#linkTitles.forEach(lt => lt.classList.remove('show'));
  }

  toggleLinks(linkTitle) {
    this.#linkTitles.forEach(lt => {
      if (lt !== linkTitle) lt.classList.remove('show');
    });
    linkTitle.classList.toggle('show');
  }

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

  addHoverSelectPostersHandler(handler) {
    this.#posterLinks.forEach((link, index) => {
      link.setAttribute('data-ag-image-order', index + 1);
    });

    let timeoutID;
    let lastLink = null;
    let lastOrder = null;

    this.#leftBody.addEventListener('mousemove', event => {
      if (window.innerWidth <= 1040) return;

      const link = event.target.closest(`.${this.#posterLinksClass}`);

      if (!link) {
        if (!lastLink) return;

        timeoutID = setTimeout(handler.bind(null, MAIN), ANIMATION_TIMEOUT);
        lastLink = null;
      } else {
        if (link === lastLink) return;

        // Clear timeout setting main images
        if (timeoutID) clearTimeout(timeoutID);

        const order = link.dataset.agImageOrder;
        // last poster removes index --> check in case last poster is null (first hover)
        // z-index-1 sets `z-index: 1` help the image chosen takes
        $(`.ag-poster--${lastOrder}`)?.classList.remove('z-index-1');
        $(`.ag-poster--${order}`).classList.add('z-index-1');

        handler(SUB);
        lastLink = link;
        lastOrder = order;
      }
    });
  }

  addOpenLinksHandler(handler) {
    this.#leftBody.addEventListener('click', event => {
      const target = event.target.closest(`.${this.#linkTitlesClass}`);
      if (target) handler(target);
    });
  }
}

export default new ExploreAllgamesView();
