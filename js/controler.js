import subWebView from './views/subWebView.js';
import mainHeaderView from './views/mainHeaderView.js';

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
};

init();
