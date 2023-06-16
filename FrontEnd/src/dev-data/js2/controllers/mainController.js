import {
  ADD,
  ANIMATION_TIMEOUT,
  CONTENT,
  END,
  ERROR,
  LOADING,
  NONE,
  REMOVE,
  START,
} from '../../../js/config';
import { $, $$, $_, classRemove } from '../../../js/helpers';

const sidebar = $('.explore-games');
const sidebarHeader = $('.explore-games__header');
const mainBody = $('.explore-games__body');
const mainBtn = $('.main-header__games');
const closeButton = $('.explore-games__header-more-close');

const openSidebarEvent = 'openSidebarEvent';

let sidebarIsOpening;
let sidebarIsClosing;

/*
node --> animated element
classes --> {
  start: class animation for opening,
  end: class animation for closing
}
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
const loadings = $$('.eg-poster-loading');
const loadingError = document.querySelector('.explore-games__body-error');

links.forEach(link =>
  link.addEventListener('click', function (event) {
    if (this.classList.contains('loading')) event.preventDefault();
  })
);

const displayContent = state => {
  if (state === NONE || state === ERROR) {
    posters.forEach((poster, index) => {
      // Can not use class `remove`, we need to keep images to remain size of the sidebar
      poster.classList.add('hide');
      links[index].classList.remove('loading');
      classRemove(ADD, loadings[index]);
    });

    classRemove(state === NONE ? ADD : REMOVE, loadingError);
  }

  if (state === LOADING) {
    console.log(123);

    classRemove(ADD, loadingError);

    posters.forEach((poster, index) => {
      // Can not use class `remove`, we need to keep images to remain size of the sidebar
      poster.classList.remove('hide');
      links[index].classList.add('loading');
      classRemove(REMOVE, loadings[index]);
    });
  }

  if (state === CONTENT) {
    posters.forEach((poster, index) => {
      // Can not use class `remove`, we need to keep images to remain size of the sidebar
      poster.classList.remove('hide');
      links[index].classList.remove('loading');
      classRemove(ADD, loadings[index]);
    });
  }
};

displayContent(NONE); // Display NONE by default

// displayContent(ERROR);
// displayContent(LOADING);
// displayContent(CONTENT);

const state = {
  isExploreGamesFetchData: false,
};

const fetchData = async () => {
  try {
    displayContent(LOADING);

    console.log(456);

    const start = Date.now();
    while (Date.now() - start < 1000) {}

    // throw new Error();
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

const errorButton = $_($('.explore-games__body-error'), 'button');

errorButton.addEventListener('click', handleData);
