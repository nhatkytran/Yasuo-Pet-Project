import {
  BACKEND_URL,
  FETCH_START,
  FETCH_END,
  VIDEO_STATE_PLAY,
  VIDEO_STATE_PAUSE,
  VIDEO_STATE_REPLAY,
  ANIMATION_TIMEOUT,
  FADE_IN,
  FADE_OUT,
  SPEAKER_STATE,
  DRAG_VOLUME,
  ADD,
  REMOVE,
} from '../config';
import { $, $$, $_, $$_ } from '../helpers';

class SubwebView {
  #fetchButton = $('.trailer__play-video-play');
  #fetchLoading = $('.trailer__play-video-loading');
  #fetchSuccess = $('.trailer__play-video-success');
  #fetchMessage = $('.trailer__play-video-message');

  #trailerVideo = $('.trailer__bg-small-video');
  #trailerImage = $('.trailer__bg-small-image');

  #trailerContent = $('.trailer__content');

  #errorMessageCommon = 'Something went wrong!';
  #errorMessageTimeout = 'Request timout error!';
  #errorMessageUserAction = 'User canceled request!';

  #videoStateButtons = $$('.trailer__play-video-success-control svg');
  #speakerWrapper = $('.trailer__play-video-success-speakers');
  #speakers = $$_(this.#speakerWrapper, 'svg');
  #speakerProgressWrapper = $('.trailer__play-video-success-bar');
  #speakerProgressBar = $('.trailer__play-video-success-bar-active');

  #purchaseSkinsButton = $('.trailer__content-button-border');

  // in | out
  #animateTrailerContent = (currentState, expectedState) => {
    this.#trailerContent.classList.remove(currentState);
    this.#trailerContent.classList.add(expectedState);
  };

  #displayTrailerContent = (() => {
    let trailerContentTimeoutID;

    const trailerContentFadeOut = () => {
      if (trailerContentTimeoutID) clearTimeout(trailerContentTimeoutID);
      this.#trailerContent.classList.remove('remove');
      this.#animateTrailerContent(FADE_OUT, FADE_IN);
    };

    const trailerContentFadeIn = () => {
      this.#animateTrailerContent(FADE_IN, FADE_OUT);
      trailerContentTimeoutID = setTimeout(() => {
        this.#trailerContent.classList.add('remove');
      }, ANIMATION_TIMEOUT);
    };

    return function (action) {
      if (action === ADD) trailerContentFadeOut();
      if (action === REMOVE) trailerContentFadeIn();
    };
  })();

  #displayControlPanel(currentPanel) {
    [
      this.#fetchButton,
      this.#fetchLoading,
      this.#fetchSuccess,
      this.#fetchMessage,
    ].forEach(panel => {
      if (panel === currentPanel) currentPanel.classList.remove('remove');
      else panel.classList.add('remove');
    });
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
    this.renderUI(FETCH_END);
    this.#trailerImage.classList.add('hide');
    this.#displayTrailerContent(REMOVE);
    this.#trailerVideo.play();
  }

  renderUI(state) {
    if (state === FETCH_START) {
      this.#resetErrorMessage();
      this.#displayControlPanel(this.#fetchLoading);
    }
    if (state === FETCH_END) this.#displayControlPanel(this.#fetchSuccess);
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
      button.dataset.videoControlState === expectedState
        ? button.classList.remove('remove')
        : button.classList.add('remove')
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
      speakerIndex === index
        ? speaker.classList.remove('remove')
        : speaker.classList.add('remove')
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
