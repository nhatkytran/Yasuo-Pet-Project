import {
  BACKEND_URL,
  FETCH_START,
  FETCH_END,
  VIDEO_STATE_PLAY,
  VIDEO_STATE_PAUSE,
  VIDEO_STATE_REPLAY,
  SPEAKER_STATE,
  CLICK_VOLUME,
  DRAG_VOLUME,
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

  #displayControlPanel(currentPanel) {
    [
      this.#fetchButton,
      this.#fetchLoading,
      this.#fetchSuccess,
      this.#fetchMessage,
    ].forEach(panel => panel.classList.add('remove'));
    currentPanel.classList.remove('remove');
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
    this.#trailerImage.classList.add('hide');
    this.renderUI(FETCH_END);
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
  }

  playVideo() {
    this.#displayControlVideoState(VIDEO_STATE_PAUSE);
    this.#trailerVideo.play();
  }

  replayVideoUI() {
    this.#displayControlVideoState(VIDEO_STATE_REPLAY);
    this.#trailerImage.classList.remove('hide');
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
      this.#speakerProgressBar,
      this.#speakerProgressWrapper
    );
  }

  calculateNewSpeakerVolume(event, action) {
    let progressBar;

    const { clientX } = event;
    const {
      left,
      right,
      width: progressWrapper,
    } = this.#speakerProgressWrapper.getBoundingClientRect();

    if (action === CLICK_VOLUME) progressBar = clientX - left;
    // if (action === DRAG_VOLUME) {}

    return this.#calculateSpeakerVolume(progressBar, progressWrapper);
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
