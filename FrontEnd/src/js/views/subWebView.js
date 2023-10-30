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
  SPEAKER_STATE,
  DRAG_VOLUME,
} from '../config';

import {
  $,
  $$,
  $_,
  $$_,
  addEvent,
  animateFactory,
  classRemove,
} from '../utils';

class SubwebView {
  #fetchButton;
  #fetchLoading;
  #fetchSuccess;
  #fetchMessage;

  #trailerVideo;
  #trailerImage;
  #trailerContent;

  #errorMessageCommon;
  #errorMessageTimeout;
  #errorMessageUserAction;

  #videoStateButtons;
  #speakerWrapper;
  #speakers;
  #speakerProgressWrapper;
  #speakerProgressBar;

  #loginButton;
  #purchaseSkinsButton;

  #animateTrailerContent;

  constructor() {
    const classPlayVideo = state => `.trailer__play-video-${state}`;
    const classBg = item => `.trailer__bg-small-${item}`;
    const classPlaySuccess = item => `.trailer__play-video-success-${item}`;

    this.#fetchButton = $(classPlayVideo('play'));
    this.#fetchLoading = $(classPlayVideo('loading'));
    this.#fetchSuccess = $(classPlayVideo('success'));
    this.#fetchMessage = $(classPlayVideo('message'));

    this.#trailerVideo = $(classBg('video'));
    this.#trailerImage = $(classBg('image'));
    this.#trailerContent = $('.trailer__content');

    this.#errorMessageCommon = 'Something went wrong!';
    this.#errorMessageTimeout = 'Request timout error!';
    this.#errorMessageUserAction = 'User canceled request!';

    this.#videoStateButtons = $$(`${classPlaySuccess('control')} svg`);
    this.#speakerWrapper = $(classPlaySuccess('speakers'));
    this.#speakers = $$_(this.#speakerWrapper, 'svg');
    this.#speakerProgressWrapper = $(classPlaySuccess('bar'));
    this.#speakerProgressBar = $(classPlaySuccess('bar-active'));

    this.#loginButton = $('.sub-header__content-login');
    this.#purchaseSkinsButton = $('.trailer__content-button-border');

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

  #displaySpeaker = percent => {
    // Speaker'state --> Muted | Slow | Medium | High
    const speakerIndex = Math.ceil((percent / 100) * SPEAKER_STATE);

    this.#speakers.forEach((speaker, index) =>
      classRemove(speakerIndex === index ? REMOVE : ADD, speaker)
    );
  };

  #calculateSpeakerVolume = (progressBar, progressWrapper) =>
    (progressBar / progressWrapper) * 100;

  checkSpeakerVolume() {
    return this.#calculateSpeakerVolume(
      this.#speakerProgressBar.getBoundingClientRect().width,
      this.#speakerProgressWrapper.getBoundingClientRect().width
    );
  }

  calculateNewSpeakerVolume(event, action) {
    let { clientX } = event;

    const {
      left,
      right,
      width: progressWrapper,
    } = this.#speakerProgressWrapper.getBoundingClientRect();

    if (action === DRAG_VOLUME) {
      if (clientX < left) clientX = left;
      if (clientX > right) clientX = right;
    }

    const progressBar = clientX - left;
    return this.#calculateSpeakerVolume(progressBar, progressWrapper);
  }

  renderSpeakerAndProgress(speakerVolume) {
    this.#speakerProgressBar.style.width = `${speakerVolume}%`;
    this.#displaySpeaker(speakerVolume);
  }

  adjustSpeakerVolume(speakerVolume) {
    this.#trailerVideo.volume = speakerVolume / 100;
  }

  //
  // Events listening //////////
  //

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
    this.#speakerProgressWrapper.addEventListener(
      'mousedown',
      mousedownHandler
    );
    document.addEventListener('mousemove', dragHandler);
    document.addEventListener('mouseup', mouseupHandler);
  }
}

export default new SubwebView();
