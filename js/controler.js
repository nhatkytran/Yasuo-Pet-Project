import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';

import subWebView from './views/subWebView.js';
import mainHeaderView from './views/mainHeaderView.js';
import allGamesView from './views/allGamesView.js';
import exploreGamesView from './views/exploreGamesView.js';
import universView from './views/universeView.js';
import universeMobileView from './views/universeMobileView.js';
import languagesView from './views/languagesView.js';
import abilitiesView from './views/abilitiesView.js';
import skinsViewLeft from './views/skinsView/skinsViewLeft.js';
import skinsViewRight from './views/skinsView/skinsViewRight.js';
import scrollView from './views/scrollView.js';
import autoScrollView from './views/autoScrollView.js';
import mainToastView from './views/Toast/mainToastView.js';

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
  action === 'open' && allGamesView.handleOpen();
  action === 'close' && allGamesView.handleClose();
};

const controlAllGamesFunction = function ([hovered, event]) {
  allGamesView.handleHover(hovered, event, model.state.allGamesHover);
};

const controlAllGamesFunctionMobile = function (item) {
  allGamesView.handleFunctionMobile(item);
};

// Explore games
const controlExploreGames = function (action) {
  action === 'open' && exploreGamesView.handleOpen();
  action === 'close' && exploreGamesView.handleClose();
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
  action === 'open' && universeMobileView.openMenu();
  action === 'close' && universeMobileView.closeMenu();
};

const controlMobileUniverse = function () {
  universeMobileView.handleUniverse();
};

// Languages
const controlLanguages = function (id) {
  languagesView.handleLanguages(id, model.state.storyLanguages[id]);
};

const controlSeeMore = function () {
  languagesView.handleSeeMore();
};

// Abilities
const controlAbilities = function (skill) {
  abilitiesView.handleSkill(skill, model.state.skillsDetail);
};

// Skins
const controlSlides = function (action) {
  action === 'right' && skinsViewRight.handleGoRight(model.state.nameSkins);
  action === 'left' && skinsViewLeft.handleGoLeft(model.state.nameSkins);
};

// Scroll
const handleInformationScroll = function (state) {
  scrollView.handleInformationScroll(state ? 'add' : 'remove');
};

const handleAbilitiesScroll = function (state) {
  scrollView.handleAbilitiesScroll(state ? 'add' : 'remove');
};

const handleSkinsScroll = function (state) {
  if (state) scrollView.handleSkinsScroll();
};

// Auto scroll
const controlAutoScroll = function (id) {
  autoScrollView.handleAutoScroll(id);
};

// Scroll to top
const controlScrollToTop = function () {
  autoScrollView.handleScrollToTop();
};

// Toast
const controlToast = function (type) {
  mainToastView.handleToast(model.state.toasts, type);
};

const controlClearToast = function (target) {
  mainToastView.handleClearToast(target);
};

const controlObserveToasts = function (type) {
  mainToastView.handleToast(model.state.toasts, type);
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

  // Abilities
  abilitiesView.addHandlerSkill(controlAbilities);

  // Skins
  skinsViewRight.addHandlerGoRight(controlSlides);
  skinsViewLeft.addHandlerGoLeft(controlSlides);

  // Scroll
  scrollView.addHandlerInformationScroll(handleInformationScroll);
  scrollView.addHandlerAbilitiesScroll(handleAbilitiesScroll);
  scrollView.addHandlerSkinsScroll(handleSkinsScroll);

  // Auto scroll
  autoScrollView.addHandlerAutoScroll(controlAutoScroll);

  // Scroll to top
  autoScrollView.addHandlerScrollToTop(controlScrollToTop);

  // Toast
  mainToastView.addToastHandler(controlToast);
  mainToastView.addClearToastHandler(controlClearToast);
  mainToastView.addObserverToastHandler(controlObserveToasts);
  // Toast // Side section
  // Button, link,... that lead to no where
  // Unpdate later
  mainToastView.playForFree(controlToast);
  mainToastView.mainHeaderButton(controlToast);
  mainToastView.championButton(controlToast);
  mainToastView.exploreSkinsButton(controlToast);
  mainToastView.downloadButtons(controlToast);
  mainToastView.footer2(controlToast);
  mainToastView.footer3Social(controlToast);
  mainToastView.footer3Privacy(controlToast);
  mainToastView.allGamesLeft(controlToast);
  mainToastView.allGamesRight(controlToast);
  mainToastView.exploreGames(controlToast);
};

init();
