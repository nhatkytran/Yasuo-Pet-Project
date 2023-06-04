import axios from 'axios';
import { BACKEND_URL } from '../../../js/config';

const bodyLeft = document.querySelector('.sb-ag-body__left');

// bodyLeft.classList.add('remove');

const bars = document.querySelectorAll('.sb-ag-body__left-loading span');

function skeletonLoading() {
  bars.forEach(bar => {
    let width = Math.random() * 100;
    if (width < 20) width = 20;

    bar.style.width = `${width}%`;

    let height = Math.random() * 2;
    if (height < 1) height = 1;

    bar.style.height = `${height}rem`;
  });
}

// let intervalID = setInterval(() => {
//   skeletonLoading();
// }, 1500);

// /////////////

// Observer pattern
// Cache state
// Body view --> Function for open or close modal
// User closes sidebar during fetching --> Stop fetching

const mainHeader = document.querySelector('.main-header');
const sidebarAllGames = document.querySelector('.sb-ag');
const sidebarAllGamesHeader = document.querySelector('.sb-ag-header');
const sidebarAllGamesBody = document.querySelector('.sb-ag-body');
const sidebarAllGamesCloseButton = document.querySelector(
  '.sb-ag-header__close'
);

const state = {
  cache: false,
  data: {},
};

// const bodyLeft
const bodyLeftLoading = document.querySelector('.sb-ag-body__left-loading');
const bodyLeftLoadingInner = document.querySelector(
  '.sb-ag-body__left-loading-inner'
);
const bodyLeftLoadingError = document.querySelector(
  '.sb-ag-body__left-loading-error'
);

const bodyLeftLoadingErrorButton = bodyLeftLoadingError.querySelector('button');

const bodyRight = document.querySelector('.sb-ag-body__right');
const bodyRightLoading = document.querySelector('.sb-ag-body__right-loading');
const bodyRightLoadingInner = document.querySelector(
  '.sb-ag-body__right-loading-inner'
);
const bodyRightLoadingError = document.querySelector(
  '.sb-ag-body__right-loading-error'
);

const displayContentOrLoading = state => {
  if (state === 'loading') {
    bodyLeft.classList.add('remove');
    bodyRight.classList.add('remove');
    bodyLeftLoading.classList.remove('remove');
    bodyRightLoading.classList.remove('remove');

    displayLoadingInner();
  }
  if (state === 'content') {
    bodyLeft.classList.remove('remove');
    bodyRight.classList.remove('remove');
    bodyLeftLoading.classList.add('remove');
    bodyRightLoading.classList.add('remove');
  }
  if (state === 'none') {
    bodyLeft.classList.add('remove');
    bodyRight.classList.add('remove');
    bodyLeftLoading.classList.add('remove');
    bodyRightLoading.classList.add('remove');
  }
};

const displayLoadingInner = () => {
  bodyLeftLoadingInner.classList.remove('remove');
  bodyLeftLoadingError.classList.add('remove');

  bodyRightLoadingInner.classList.remove('remove');
  bodyRightLoadingError.classList.add('remove');
};

const displayLoadingError = () => {
  bodyLeftLoadingInner.classList.add('remove');
  bodyLeftLoadingError.classList.remove('remove');

  bodyRightLoadingInner.classList.add('remove');
  bodyRightLoadingError.classList.remove('remove');

  console.log('Display Error!');
};

bodyLeftLoadingErrorButton.addEventListener('click', () => {
  fetchThenDisplayData();
});

let intervalID;

const startSkeletionLoading = () => {
  setTimeout(() => {
    skeletonLoading();
  }, 100);

  intervalID = setInterval(() => {
    skeletonLoading();
  }, 1500);
};
const endSkeletonLoading = () => {
  if (intervalID) clearInterval(intervalID);
};

let controller;

const startFetching = async () => {
  try {
    controller = new AbortController();

    const { data } = await axios({
      method: 'GET',
      signal: controller.signal,
      url: 'http://127.0.0.1:3000/api/v1/allGames/data',
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const promisifyLoadingImage = (image, source) =>
  new Promise((resolve, reject) => {
    const loadController = new AbortController();
    const errorController = new AbortController();

    const loadHandler = () => {
      errorController.abort();
      resolve();
    };
    const errorHandler = () => {
      loadController.abort();
      reject();
    };

    image.addEventListener('load', loadHandler, {
      once: true,
      signal: loadController.signal,
    });
    image.addEventListener('error', errorHandler, {
      once: true,
      signal: errorController.signal,
    });

    image.src = source;
  });

const createMainImages = async images => {
  try {
    const bodyRightImages = bodyRight.querySelectorAll(
      '.sb-ag-body__right-img'
    );
    const promises = [...bodyRightImages].map((image, index) =>
      promisifyLoadingImage(image, `${BACKEND_URL}${images[index].link}`)
    );

    await Promise.all(promises);
  } catch (error) {
    console.log('*** Error load All!');
    throw error;
  }
};

const createPosterGenerateMarkup = (smallImages, posterOptions) => {
  const imageOrText = (isImage, content) =>
    isImage
      ? `<img class="ag-poster__header-image" src="" alt=${content} />`
      : `<span class="ag-poster__header-label">${content}</span>`;

  const supportPlatform = platforms => {
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

  const { colors, descriptions, image_alts, platforms } = posterOptions;

  return smallImages
    .map(
      (image, index) => `
        <div class="ag-poster ag-poster--${index + 1}">
          <img class="ag-poster__image" src="" alt="${image_alts[index]}">
          <div class="ag-poster__background" style="${colors.bg[index]}">
            <div class="ag-poster__content">
              <div class="ag-poster__header">
                ${imageOrText(image.type !== 'text', image_alts[index])}
              </div>
              <p class="ag-poster__description">${descriptions[index]}</p>
              ${
                platforms[index].length
                  ? `<div class="ag-poster__platform">
                    ${supportPlatform(platforms[index])}
                  </div>`
                  : ''
              }
            </div>
          </div>
        </div>
      `
    )
    .join('');
};

const createPosterImages = async (images, ...imageEls) => {
  const imagesPromisifying = imageEls.map((image, index) =>
    promisifyLoadingImage(image, `${BACKEND_URL}${images[index].link}`)
  );
  await Promise.all(imagesPromisifying);
};

const createPosterLargeImages = async largeImages => {
  const imageEls = document.querySelectorAll('.ag-poster__image');
  await createPosterImages(largeImages, ...imageEls);
};

const createPosterSmallImages = async smallImages => {
  const smallImagesOnly = smallImages.filter(image => image.type !== 'text');
  const imageEls = document.querySelectorAll('.ag-poster__header-image');
  await createPosterImages(smallImagesOnly, ...imageEls);
};

const createPoster = async (images, posterOptions) => {
  const { larges: largeImages, smalls: smallImages } = images;

  const markup = createPosterGenerateMarkup(smallImages, posterOptions);
  const posterContainer = document.querySelector('.ag-poster-container');

  // Create poster's structure
  posterContainer.insertAdjacentHTML('afterbegin', markup);

  // Add poster's image
  // Each poster has its large image
  // Not every poster has samll image, some of the have title (added along with structure)
  await Promise.all([
    createPosterLargeImages(largeImages),
    createPosterSmallImages(smallImages),
  ]);
};

const fetchThenDisplayData = async () => {
  try {
    displayContentOrLoading('loading');
    startSkeletionLoading();

    const data = await startFetching();

    console.log(data);

    const { images, ...posterOptions } = data.allGamesAssets;
    await Promise.all([
      createMainImages(images.main),
      createPoster(images.side, posterOptions),
    ]);

    state.cache = true;
    state.data = data.allGamesAssets;

    displayContentOrLoading('content');
  } catch (error) {
    console.error('Display data when error happens');
    console.error(error);

    displayLoadingError();
  } finally {
    endSkeletonLoading();
  }
};

const displayData = () => {
  console.log('Display Data!');
  displayContentOrLoading('content');
};

sidebarAllGames.addEventListener('openAllGames', () => {
  if (!state.cache) {
    fetchThenDisplayData();
  } else {
    displayData();
  }
});

const modal = document.querySelector('#modal');
let scrollVertical;
let modalIsClosing = false;

// User click open then close immediately
let modalIsOpening = false;

// sidebarAllGamesCloseButton --> click
modal.addEventListener('click', () => {
  // Handle user click multiple times while modal is closing
  if (modalIsOpening || modalIsClosing) return;

  modalIsClosing = true;

  if (controller) controller.abort();

  displayContentOrLoading('none');

  document.body.removeAttribute('style');
  window.scrollTo({ top: scrollVertical });
  modal.classList.remove('fade-in');

  //

  sidebarAllGames.classList.remove('sidebar-arrow-open');
  sidebarAllGames.classList.add('sidebar-arrow-close');

  sidebarAllGamesHeader.classList.remove('fade-in');

  setTimeout(() => {
    modalIsClosing = false;
    sidebarAllGames.classList.add('remove');
    document.body.classList.remove('modal-open');
    displayContentOrLoading('none');
  }, 240);
});

const handleOpenAllGames = () => {
  modalIsOpening = true;

  document.body.classList.add('modal-open');
  modal.classList.add('fade-in');
  scrollVertical = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollVertical}px`;

  //
  sidebarAllGames.classList.remove('remove');
  sidebarAllGames.classList.remove('sidebar-arrow-close');
  sidebarAllGames.classList.add('sidebar-arrow-open');

  sidebarAllGamesHeader.classList.add('fade-in');

  setTimeout(() => {
    modalIsOpening = false;
    sidebarAllGames.dispatchEvent(new CustomEvent('openAllGames'));
  }, 240);
};

const mainHeaderClass = 'main-header';
mainHeader.addEventListener('click', function (event) {
  let currentElement = event.target;

  const checkContains = className =>
    currentElement.classList.contains(className);

  while (currentElement) {
    if (checkContains(mainHeaderClass)) return;
    if (checkContains('main-header__riot')) {
      handleOpenAllGames();
      return;
    }

    currentElement = currentElement.parentNode;
  }
});

// Super Hover //////////

const body = document.querySelector('.sb-ag-body');
const bodyRightPoster = document.querySelector('.ag-poster-container');
const classLink = 'sb-ag-body__left-link';
const links = document.querySelectorAll(`.${classLink}`);

links.forEach((link, index) => {
  link.setAttribute('data-ag-image-order', index + 1);
});

const posters = document.querySelectorAll('.ag-poster');
posters.forEach((poster, index) =>
  poster.classList.add(`ag-poster--${index + 1}`)
);

const displayMain = () => {
  bodyRight.classList.remove('remove');
  bodyRightPoster.classList.add('remove');
};
const displayPoster = () => {
  bodyRight.classList.add('remove');
  bodyRightPoster.classList.remove('remove');
};

let displayTimeoutId;
let lastLink = null;
let lastPosterOrder = null;

body.addEventListener('mousemove', event => {
  const link = event.target.closest(`.${classLink}`);

  if (!link) {
    if (lastLink === null) return;

    displayTimeoutId = setTimeout(displayMain, 240);
    lastLink = null;
  } else {
    if (link === lastLink) return;

    // Clear timeout setting main images
    if (displayTimeoutId) clearTimeout(displayTimeoutId);

    const { agImageOrder: order } = link.dataset;

    // z-index-1 sets `z-index: 1` help the image chosen takes precedence
    // last poster removes index
    // check incase last poster is null
    if (lastPosterOrder)
      document
        .querySelector(`.ag-poster--${lastPosterOrder}`)
        .classList.remove('z-index-1');

    // set index for current poster
    document.querySelector(`.ag-poster--${order}`).classList.add('z-index-1');

    displayPoster();

    lastLink = link;
    lastPosterOrder = order;
  }
});
