import * as model from './model.js';

import subWebView from './views/subWebView.js';
import mainHeaderView from './views/mainHeaderView.js';
import allGamesView from './views/allGamesView.js';
import exploreGamesView from './views/exploreGamesView.js';
import universView from './views/universeView.js';
import universeMobileView from './views/universeMobileView.js';
import languagesView from './views/languagesView.js';

// Sub website
const controlVideo = function (...videos) {
  videos.forEach(video => video.play());
};

const controlStar = function () {
  subWebView.addBackgroundStar();
};

// Main header
const controlMainHeader = function (isSticky) {
  mainHeaderView.handleSticky(isSticky ? 'add' : 'remove');
};

// All games
const controlAllGames = function (action) {
  switch (action) {
    case 'open':
      allGamesView.handleOpen();
      break;
    case 'close':
      allGamesView.handleClose();
      break;
    default:
      throw new Error('Something went wrong!');
  }
};

const controlAllGamesFunction = function ([hovered, event]) {
  allGamesView.handleHover(hovered, event, model.state.allGamesHover);
};

const controlAllGamesFunctionMobile = function (item) {
  allGamesView.handleFunctionMobile(item);
};

// Explore games
const controlExploreGames = function (action) {
  switch (action) {
    case 'open':
      exploreGamesView.handleOpen();
      break;
    case 'close':
      exploreGamesView.handleClose();
      break;
    default:
      throw new Error('Something went wrong!');
  }
};

// Universe
const controlUniverse = function () {
  universView.toggleUniverse();
};

const controlUniverseSurprise = function () {
  universView.closeUniverseSurprise();
};

// Universe mobile
const controlMobileMenu = function (action) {
  switch (action) {
    case 'open':
      universeMobileView.openMenu();
      break;
    case 'close':
      universeMobileView.closeMenu();
      break;
    default:
      throw new Error('Something went wrong!');
  }
};

const controlMobileUniverse = function () {
  universeMobileView.handleUniverse();
};

// Languages
const controlLanguages = function (id) {
  const paragraph = model.state.storyLanguages[id];

  languagesView.render(paragraph);
};

const controlSeeMore = function () {
  languagesView.handleSeeMore();
};

const init = function () {
  // Sub website
  // if (window.innerWidth >= 640) {
  //   // Play video
  //   subWebView.addHandlerPlay(controlVideo);
  //   // Star background
  //   subWebView.addHandlerStop(controlStar);
  // } else {
  //   // Star background on mobile device
  //   subWebView.addBackgroundStar();
  // }

  // Main header
  mainHeaderView.addHandlerObserver(controlMainHeader);

  // All games
  allGamesView.addHandlerOpen(controlAllGames);
  allGamesView.addHandlerClose(controlAllGames);
  allGamesView.addHandlerFunction(controlAllGamesFunction);
  allGamesView.addHandlerFunctionMobile(controlAllGamesFunctionMobile);

  // Explore games
  exploreGamesView.addHandlerOpen(controlExploreGames);
  exploreGamesView.addHandlerClose(controlExploreGames);

  // Universe
  universView.addHandlerUniverse(controlUniverse);
  universView.addHandlerUniverseCloseSurprise(controlUniverseSurprise);

  // Universe mobile
  universeMobileView.addHandlerOpenMenu(controlMobileMenu);
  universeMobileView.addHandlerUniverse(controlMobileUniverse);
  universeMobileView.addHandlerCloseMenu(controlMobileMenu);

  // Languages
  languagesView.addHandlerChooseLanguage(controlLanguages);
  languagesView.addHandlerSeeMore(controlSeeMore);
};

init();
