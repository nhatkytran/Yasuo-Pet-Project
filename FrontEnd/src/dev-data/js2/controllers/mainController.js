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

// Promisify

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

const createPosterGenerateMarkup = (numberOfPosters, posterOptions) => {
  const { colors, descriptions, image_alts } = posterOptions;

  return Array(numberOfPosters)
    .fill(null)
    .map((_, index) => `<div>${index + 1}</div>`)
    .join('');
};

const createPoster = async (images, posterOptions) => {
  try {
    const { larges: largeImages, smalls: smallImages } = images;

    const numberOfPosters = largeImages.length;
    const markup = createPosterGenerateMarkup(numberOfPosters, posterOptions);

    console.log(markup);
  } catch (error) {
    console.log('*** Error Poster!');
    throw error;
  }
};

const createImages = async (images, posterOptions) => {
  try {
    await createMainImages(images.main);
    await createPoster(images.side, posterOptions);

    return true;
  } catch (error) {
    return false;
  }
};

const fetchThenDisplayData = async () => {
  try {
    displayContentOrLoading('loading');
    startSkeletionLoading();

    const data = await startFetching();

    console.log(data);

    const { images, colors, descriptions, image_alts } = data.allGamesAssets;
    const posterOptions = { colors, descriptions, image_alts };

    const isImageDisplayOk = await createImages(images, posterOptions);

    if (!isImageDisplayOk) throw new Error('Error loading images!');

    state.cache = true;
    state.data = data.allGamesAssets;

    displayContentOrLoading('content');
  } catch (error) {
    console.error('Display data when error happens');
    console.log(error);

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

  //

  modal.classList.remove('fade-in');
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

// Super Hover

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
