import axios from 'axios';

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

const startFetching = async () => {
  try {
    const { data } = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/allGames/data',
    });

    return data;
  } catch (error) {
    throw error;
  }
};

const fetchThenDisplayData = async () => {
  try {
    displayContentOrLoading('loading');
    // Turn on loading animation

    const data = await startFetching();

    console.log(data);
  } catch (error) {
    console.error('Display data when error happens');
    console.log(error);
  } finally {
    // Turn of adnimation of loading (performance)
    // Hide loading
  }
};

const displayData = () => {
  // All actions like add image handled by fetchThenDisplayData function
  displayContentOrLoading('content');
  console.log('Display Data!');
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
