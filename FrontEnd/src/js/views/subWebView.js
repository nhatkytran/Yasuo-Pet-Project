import {
  BACKEND_URL,
  START,
  END,
  ADD,
  REMOVE,
  VIDEO_STATE_PLAY,
  VIDEO_STATE_PAUSE,
  VIDEO_STATE_REPLAY,
  ANIMATION_TIMEOUT,
  FADE_IN,
  FADE_OUT,
  SPEAKER_STATE,
  DRAG_VOLUME,
} from '../config';

import { $, $$, $_, $$_, animateFactory, classRemove } from '../utils';

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

    this.#purchaseSkinsButton = $('.trailer__content-button-border');

    this.#animateTrailerContent = animateFactory(this.#trailerContent, {
      start: FADE_IN,
      end: FADE_OUT,
    });
  }

  #displayTrailerContent = this.#displayTrailerContentFactory();
  #displayTrailerContentFactory() {
    let trailerContentTimeoutID;

    const trailerContentFadeOut = () => {
      if (trailerContentTimeoutID) clearTimeout(trailerContentTimeoutID);

      classRemove(REMOVE, this.#trailerContent);
      this.#animateTrailerContent(START);
    };

    const trailerContentFadeIn = () => {
      this.#animateTrailerContent(END);

      trailerContentTimeoutID = setTimeout(() => {
        classRemove(ADD, this.#trailerContent);
      }, ANIMATION_TIMEOUT);
    };

    return function (action) {
      if (action === ADD) trailerContentFadeOut();
      if (action === REMOVE) trailerContentFadeIn();
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
    [linkMp4, linkWebm].forEach(link => {
      const videoLink = `${BACKEND_URL}${link}`;
      const source = document.createElement('source');

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

  renderUI(state) {
    if (state === START) {
      this.#resetErrorMessage();
      this.#displayControlPanel(this.#fetchLoading);
    }
    if (state === END) this.#displayControlPanel(this.#fetchSuccess);
  }

  #resetErrorMessage() {
    this.#handleErrorMessage(this.#errorMessageCommon);
  }

  #handleErrorMessage(message) {
    $_(this.#fetchMessage, 'p').textContent = message;
  }

  handleTimeoutErrorMessage() {
    this.#handleErrorMessage(this.#errorMessageTimeout);
  }

  handleAbortErrorMessage() {
    this.#handleErrorMessage(this.#errorMessageUserAction);
  }

  renderError() {
    this.#displayControlPanel(this.#fetchMessage);
  }

  #displayControlVideoState = expectedState =>
    this.#videoStateButtons.forEach(button =>
      classRemove(
        button.dataset.videoControlState === expectedState ? REMOVE : ADD,
        button
      )
    );

  checkVideoStateRequired = button => button.dataset.videoControlState;

  pauseVideo() {
    this.#displayControlVideoState(VIDEO_STATE_PLAY);
    this.#trailerVideo.pause();
    this.#displayTrailerContent(ADD);
  }

  playVideo() {
    this.#displayControlVideoState(VIDEO_STATE_PAUSE);
    this.#trailerVideo.play();
    this.#displayTrailerContent(REMOVE);
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

  addFetchVideoHandler(handler) {
    [this.#fetchButton, $_(this.#fetchMessage, 'span')].forEach(buttonEl =>
      buttonEl.addEventListener('click', handler)
    );
  }

  addPlayVideoHandler(handler) {
    this.#trailerVideo.addEventListener('canplay', handler);
  }

  addFetchVideoHandlerAbort(handler) {
    this.#purchaseSkinsButton.addEventListener('click', handler);
  }

  addControlVideoStateHandler(handler) {
    this.#videoStateButtons.forEach(videoStateButton =>
      videoStateButton.addEventListener('click', function () {
        handler(this);
      })
    );
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
