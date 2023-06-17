import {
  ADD,
  AFTER_LAODING,
  ANIMATION_TIMEOUT,
  ANIMATION_TIMEOUT_100,
  CONTENT,
  END,
  ERROR,
  LOADING,
  NONE,
  REMOVE,
  START,
} from '../../../js/config';
import { $, $$, $_, classRemove } from '../../../js/helpers';

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
  const removeBodyState = () =>
    classRemove(ADD, bodyState, bodyStateLoading, bodyStateError);

  if (state === NONE || state === LOADING || state === ERROR) {
    // Use class `hide` for keeping images to remain thesize of the sidebar
    posters.forEach(poster => poster.classList.add('hide'));
    removeBodyState();

    if (state === NONE) return;

    classRemove(REMOVE, bodyState, LOADING ? bodyStateLoading : bodyStateError);
  }
}

const fakeFetch = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data');
    }, 1000);
  });
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
  let firstTime = true;
  if (!state.isExploreGamesFetchData) await fetchData();
  if (state.isExploreGamesFetchData) {
    displayContent(CONTENT, firstTime ? AFTER_LAODING : '');
    firstTime = false;
  }
};

sidebar.addEventListener(openSidebarEvent, () => {
  handleData();
});

const errorButton = $_($('.explore-games__body-state-error'), 'button');

errorButton.addEventListener('click', handleData);
