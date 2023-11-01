import {
  BACKEND_URL,
  ANIMATION_TIMEOUT,
  START,
  END,
  ERROR,
  ADD,
  REMOVE,
  VIDEO_STATE_PLAY,
  VIDEO_STATE_PAUSE,
  VIDEO_STATE_REPLAY,
  FADE_IN,
  FADE_OUT,
  DRAG_VOLUME,
} from '../config';

import {
  dragAndDropEvent,
  checkVolumeFactory,
  renderVolumeFactory,
  adjustVolumeFactory,
  calculateNewVolumeFactory,
} from '../libraries/speakerEvents';

import {
  $,
  $$,
  $_,
  $$_,
  addEvent,
  animateFactory,
  classRemove,
} from '../utils';

const classBg = item => `.trailer__bg-small-${item}`;
const classPlayVideo = state => `.trailer__play-video-${state}`;
const classPlaySuccess = item => `.trailer__play-video-success-${item}`;

class SubwebView {
  #fetchButton = $(classPlayVideo('play'));
  #fetchLoading = $(classPlayVideo('loading'));
  #fetchSuccess = $(classPlayVideo('success'));
  #fetchMessage = $(classPlayVideo('message'));

  #trailerVideo = $(classBg('video'));
  #trailerImage = $(classBg('image'));
  #trailerContent = $('.trailer__content');

  #errorMessageCommon = 'Something went wrong!';
  #errorMessageTimeout = 'Request timout error!';
  #errorMessageUserAction = 'User canceled request!';

  #videoStateButtons = $$(`${classPlaySuccess('control')} svg`);
  #speakerWrapper = $(classPlaySuccess('speakers'));
  #speakers = $$_(this.#speakerWrapper, 'svg');
  #speakerProgressWrapper = $(classPlaySuccess('bar'));
  #speakerProgressBar = $(classPlaySuccess('bar-active'));

  #loginButton = $('.sub-header__content-login');
  #purchaseSkinsButton = $('.trailer__content-button-border');

  #animateTrailerContent;

  constructor() {
    this.#animateTrailerContent = animateFactory(this.#trailerContent, {
      start: FADE_IN,
      end: FADE_OUT,
    });
  }

  #displayTrailerContent = this.#displayTrailerContentFactory();
  #displayTrailerContentFactory() {
    let timeoutId;

    const trailerContentFadeIn = () => {
      if (timeoutId) clearTimeout(timeoutId);

      classRemove(REMOVE, this.#trailerContent);
      this.#animateTrailerContent(START);
    };

    const trailerContentFadeOut = () => {
      this.#animateTrailerContent(END);

      timeoutId = setTimeout(() => {
        classRemove(ADD, this.#trailerContent);
      }, ANIMATION_TIMEOUT);
    };

    return action => {
      if (action === ADD) trailerContentFadeIn();
      if (action === REMOVE) trailerContentFadeOut();
    };
  }

  #displayControlPanel(currentPanel) {
    classRemove(
      ADD,
      this.#fetchButton,
      this.#fetchLoading,
      this.#fetchSuccess,
      this.#fetchMessage
    );
    classRemove(REMOVE, currentPanel);
  }

  renderVideo({ linkMp4, linkWebm }) {
    const sources = [
      [linkMp4, 'video/mp4'],
      [linkWebm, 'video/webm'],
    ];

    sources.forEach(([link, type]) => {
      const videoLink = `${BACKEND_URL}${link}`;
      const source = document.createElement('source');

      source.type = type;
      source.src = videoLink;

      this.#trailerVideo.appendChild(source);
    });
  }

  playVideoFirstTime() {
    this.renderUI(END);
    this.#trailerImage.classList.add('hide');
    this.#displayTrailerContent(REMOVE);
    this.#trailerVideo.play();
  }

  #handleErrorMessage = message =>
    ($_(this.#fetchMessage, 'p').textContent = message);

  #resetErrorMessage = () => this.#handleErrorMessage(this.#errorMessageCommon);

  handleTimeoutErrorMessage = () =>
    this.#handleErrorMessage(this.#errorMessageTimeout);

  handleAbortErrorMessage = () =>
    this.#handleErrorMessage(this.#errorMessageUserAction);

  renderUI(state) {
    if (state === START) {
      this.#resetErrorMessage();
      this.#displayControlPanel(this.#fetchLoading);
    }
    if (state === END) this.#displayControlPanel(this.#fetchSuccess);
    if (state === ERROR) this.#displayControlPanel(this.#fetchMessage);
  }

  checkVideoStateRequired = button => button.dataset.videoControlState;

  #displayControlVideoState = expectedState =>
    this.#videoStateButtons.forEach(button =>
      classRemove(
        button.dataset.videoControlState === expectedState ? REMOVE : ADD,
        button
      )
    );

  playVideo() {
    this.#displayControlVideoState(VIDEO_STATE_PAUSE);
    this.#trailerVideo.play();
    this.#displayTrailerContent(REMOVE);
  }

  pauseVideo() {
    this.#displayControlVideoState(VIDEO_STATE_PLAY);
    this.#trailerVideo.pause();
    this.#displayTrailerContent(ADD);
  }

  replayVideoUI() {
    this.#displayControlVideoState(VIDEO_STATE_REPLAY);
    this.#trailerImage.classList.remove('hide');
    this.#displayTrailerContent(ADD);
  }

  checkSpeakerVolume = checkVolumeFactory(
    this.#speakerProgressBar,
    this.#speakerProgressWrapper
  );
  renderSpeakerAndProgress = renderVolumeFactory(
    this.#speakerProgressBar,
    this.#speakers
  );
  adjustSpeakerVolume = adjustVolumeFactory(this.#trailerVideo);
  calculateNewSpeakerVolume = calculateNewVolumeFactory(
    this.#speakerProgressWrapper
  );

  //
  // Events listening //////////

  addFetchVideoHandler(handler) {
    const buttons = [this.#fetchButton, $_(this.#fetchMessage, 'span')];
    addEvent(buttons, 'click', handler);
  }

  addPlayVideoHandler(handler) {
    this.#trailerVideo.addEventListener('canplay', handler);
  }

  addFetchVideoHandlerAbort(handler) {
    const buttons = [this.#loginButton, this.#purchaseSkinsButton];
    addEvent(buttons, 'click', handler);
  }

  addControlVideoStateHandler(handler) {
    addEvent(this.#videoStateButtons, 'click', handler);
  }

  addReplayVideoHandler(handler) {
    this.#trailerVideo.addEventListener('ended', handler);
  }

  addSpeakerPowerHandler(handler) {
    this.#speakerWrapper.addEventListener('click', handler);
  }

  addSpeakerProgressHandler(mousedownHandler, dragHandler, mouseupHandler) {
    dragAndDropEvent(this.#speakerProgressWrapper, {
      mousedown: mousedownHandler,
      mousemove: dragHandler,
      mouseup: mouseupHandler,
      // touchstart: mousedownHandler,
      // touchmove: dragHandler,
      // touchend: mouseupHandler,
    });
  }
}

export default new SubwebView();
