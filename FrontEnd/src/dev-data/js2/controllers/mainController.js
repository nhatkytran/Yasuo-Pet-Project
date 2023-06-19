import axios from 'axios';
import {
  ADD,
  ANIMATION_TIMEOUT,
  ANIMATION_TIMEOUT_100,
  BACKEND_URL,
  CONTENT,
  END,
  ERROR,
  LOADING,
  NONE,
  REMOVE,
  START,
} from '../../../js/config';
import {
  $,
  $$,
  $_,
  classRemove,
  promisifyLoadingImage,
} from '../../../js/helpers';

const mainBtn = $('.main-header__games');
const closeButton = $('.explore-games__header-more-close');
const sidebar = $('.explore-games');
const sidebarHeader = $('.explore-games__header');

const openSidebarEvent = 'openSidebarEvent';

let sidebarIsOpening;
let sidebarIsClosing;

/*
node --> animated element
classes --> {
  start: class animation for opening,
  end: class animation for closing
}
=> (state = START | END): void
*/
const animateFactory = (node, classes) => state => {
  if (state !== START && state !== END) throw new Error('Invalid action!');

  const add = state === START ? classes.start : classes.end;
  const remove = state === START ? classes.end : classes.start;

  Object.entries({ add, remove }).forEach(([action, classType]) =>
    node.classList[action](classType)
  );
};

const animateSidebarHeader = animateFactory(sidebarHeader, {
  start: 'fade-in',
  end: 'fade-out',
});

const animateSidebar = animateFactory(sidebar, {
  start: 'sidebar-arrow-open',
  end: 'sidebar-arrow-close',
});

mainBtn.addEventListener('click', () => {
  if (sidebarIsOpening || sidebarIsClosing) return;

  // Open modal

  sidebarIsOpening = true;

  classRemove(REMOVE, sidebar);
  animateSidebarHeader(START);
  animateSidebar(START);

  setTimeout(() => {
    sidebarIsOpening = false;
    sidebar.dispatchEvent(new CustomEvent(openSidebarEvent));
  }, ANIMATION_TIMEOUT);
});

closeButton.addEventListener('click', () => {
  if (sidebarIsOpening || sidebarIsClosing) return;

  // Abort fetching
  // Close modal

  sidebarIsClosing = true;

  animateSidebarHeader(END);
  animateSidebar(END);
  displayContent(NONE);

  setTimeout(() => {
    sidebarIsClosing = false;

    classRemove(ADD, sidebar);
  }, ANIMATION_TIMEOUT);
});

const posters = $$('.explore-games__body-poster');
const links = $$('.eg-poster');

const bodyState = $('.explore-games__body-state');
const bodyStateLoading = $_(bodyState, '.explore-games__body-state-loading');
const bodyStateError = $_(bodyState, '.explore-games__body-state-error');

displayContent(NONE);

// displayContent(ERROR);
// displayContent(LOADING);
// displayContent(CONTENT);

function displayContent(state) {
  classRemove(ADD, bodyState, bodyStateLoading, bodyStateError);

  if (state === NONE || state === LOADING || state === ERROR) {
    // Use class `hide` for keeping images to remain thesize of the sidebar
    posters.forEach(poster => {
      // `transition: 'all ease 0.2s';` is set in CSS for better animation \
      // when display content. Use `unset` when close model to get animation
      poster.style.transition = 'unset';
      poster.classList.add('hide');
      poster.style.transition = 'all ease 0.2s'; // back to first CSS set in CSS file
    });

    if (state === NONE) return;

    classRemove(
      REMOVE,
      bodyState,
      state === LOADING ? bodyStateLoading : bodyStateError
    );
  }

  if (state === CONTENT)
    posters.forEach(
      (poster, index) =>
        setTimeout(() => {
          poster.classList.remove('hide');
        }, index * ANIMATION_TIMEOUT_100 - 20) // -20 so it is a little bit faster
    );
}

const fakeFetch = async () => {
  const response = await axios.get(`${BACKEND_URL}/api/v1/exploreGames/data`);
  const data = response.data.exploreGamesAssets.images;

  const images = $$('.eg-poster-img');
  const promises = [...images].map((image, index) =>
    promisifyLoadingImage(image, `${BACKEND_URL}${data[index].link}`)
  );

  await Promise.all(promises);
};

const state = {
  isExploreGamesFetchData: false,
};

const fetchData = async () => {
  try {
    displayContent(LOADING);

    await fakeFetch();

    state.isExploreGamesFetchData = true;
  } catch (error) {
    // test
    console.error('Something went wrong!');
    console.error(error);

    displayContent(ERROR);
    // Handle abort Error
  }
};

const handleData = async () => {
  if (!state.isExploreGamesFetchData) await fetchData();
  if (state.isExploreGamesFetchData) displayContent(CONTENT);
};

sidebar.addEventListener(openSidebarEvent, () => {
  handleData();
});

const errorButton = $_($('.explore-games__body-state-error'), 'button');

errorButton.addEventListener('click', handleData);
