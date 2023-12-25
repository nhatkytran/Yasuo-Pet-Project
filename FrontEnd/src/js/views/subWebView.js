import {
  BACKEND_URL,
  REM,
  ANIMATION_TIMEOUT,
  ANIMATION_TIMEOUT_500,
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
} from '../config';

import {
  $,
  $$,
  $_,
  $$_,
  addEvent,
  animateFactory,
  classRemove,
  promisifyLoadingImage,
  promisifyLoadingVideo,
  startAnimationObserveFactory,
} from '../utils';

import {
  dragAndDropEvent,
  checkVolumeFactory,
  renderVolumeFactory,
  adjustVolumeFactory,
  calculateNewVolumeFactory,
} from '../libraries/speakerEvents';

const classBg = item => `.trailer__bg-small-${item}`;
const classPlayVideo = state => `.trailer__play-video-${state}`;
const classPlaySuccess = item => `.trailer__play-video-success-${item}`;

class SubwebView {
  #fetchButton = $(classPlayVideo('play'));
  #fetchLoading = $(classPlayVideo('loading'));
  #fetchSuccess = $(classPlayVideo('success'));
  #fetchMessage = $(classPlayVideo('message'));

  #trailerWrapper = $('.trailer__bg-small');
  #trailerVideo;
  #trailerImageWrapper = $(classBg('image-wrapper'));
  #trailerImage = $(classBg('image'));
  #trailerImageLazy = $(classBg('image-lazy'));
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
  #purchaseSkinsButton = $_(this.#trailerContent, 'button');

  #instructionWrapper = $('.volume-ins-wrapper');
  #instruction = $('.volume-ins');
  #instructionCloseButton = $_(this.#instruction, 'svg');
  #instructionOkayButton = $_(this.#instruction, 'button');

  #animateTrailerContent;
  #animateInstruction;

  constructor() {
    this.#animateTrailerContent = animateFactory(this.#trailerContent, {
      start: FADE_IN,
      end: FADE_OUT,
    });
    this.#animateInstruction = animateFactory(this.#instructionWrapper, {
      start: 'fade-in-500',
      end: 'fade-out-480',
    });
  }

  startAnimationObserve = startAnimationObserveFactory(
    [
      $('.yasuo-heading'),
      this.#trailerContent,
      $('.sh-footer__text-left'),
      $('.sh-footer__text-right'),
    ],
    ANIMATION_TIMEOUT_500
  );

  loadMainImage() {
    this.#trailerImageWrapper.classList.remove('blur');
    classRemove(REMOVE, this.#trailerImage);
    classRemove(ADD, this.#trailerImageLazy);
  }

  async lazyLoadImage() {
    await promisifyLoadingImage(
      this.#trailerImage,
      `${BACKEND_URL}/img/subHeader/video-background.png`
    );
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

  async renderVideo({ linkMp4, linkWebm }) {
    $_(this.#trailerWrapper, classBg('video'))?.remove();

    this.#trailerWrapper.insertAdjacentHTML(
      'afterbegin',
      `
        <video class="trailer__bg-small-video remove">
          Your browser does not support video!
        </video>
      `
    );
    this.#trailerVideo = $(classBg('video'));
    this.adjustSpeakerVolume = adjustVolumeFactory(this.#trailerVideo);

    await promisifyLoadingVideo(this.#trailerVideo, {
      mp4: linkMp4,
      webm: linkWebm,
    });
  }

  renderVideoFirstTime() {
    this.renderUI(END);
    classRemove(REMOVE, this.#trailerVideo);

    // 'webkitendfullscreen'
    // On device like IPhone, there is a video layer automatically opened when playing video
    this.#trailerVideo.addEventListener(
      'webkitendfullscreen',
      this.pauseVideo.bind(this)
    );
    this.#trailerVideo.addEventListener('ended', this.replayVideoUI.bind(this));
  }

  open = scrollY => {
    this.#instructionWrapper.style.top = `${scrollY / REM}rem`;
    classRemove(REMOVE, this.#instructionWrapper);
    this.#animateInstruction(START);
  };

  close = timeToClose => {
    this.#animateInstruction(END);
    setTimeout(
      classRemove.bind(null, ADD, this.#instructionWrapper),
      timeToClose
    );
  };

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
    this.#trailerImageWrapper.style.zIndex = '1';
  }

  pauseVideo() {
    // Iphone listens to 'webkitendfullscreen' event, this event call pauseVideo()
    // Check to see if the video is already finished to display replayUI
    if (this.#trailerVideo.currentTime / this.#trailerVideo.duration == 1)
      return this.replayVideoUI();

    this.#displayControlVideoState(VIDEO_STATE_PLAY);
    this.#trailerVideo.pause();
    this.#displayTrailerContent(ADD);
  }

  replayVideoUI() {
    console.log(this.#trailerVideo.currentTime / this.#trailerVideo.duration);
    this.#displayControlVideoState(VIDEO_STATE_REPLAY);
    this.#displayTrailerContent(ADD);
    this.#trailerImageWrapper.style.zIndex = '3';
  }

  checkSpeakerVolume = checkVolumeFactory(
    this.#speakerProgressBar,
    this.#speakerProgressWrapper
  );
  renderSpeakerAndProgress = renderVolumeFactory(
    this.#speakerProgressBar,
    this.#speakers
  );
  // adjustSpeakerVolume = adjustVolumeFactory(this.#trailerVideo);
  calculateNewSpeakerVolume = calculateNewVolumeFactory(
    this.#speakerProgressWrapper
  );

  //
  // Events listening //////////

  addLazyLoadingImage(handler) {
    document.addEventListener('DOMContentLoaded', () => {
      this.startAnimationObserve();
      handler();
    });
  }

  addFetchVideoHandler(handler) {
    const buttons = [this.#fetchButton, $_(this.#fetchMessage, 'span')];
    addEvent(buttons, 'click', handler);
  }

  addFetchVideoHandlerAbort(handler) {
    const buttons = [this.#loginButton, this.#purchaseSkinsButton];
    addEvent(buttons, 'click', handler);
  }

  addControlVideoStateHandler(handler) {
    addEvent(this.#videoStateButtons, 'click', handler);
  }

  addSpeakerPowerHandler(handler) {
    this.#speakerWrapper.addEventListener('click', handler);
  }

  addSpeakerProgressHandler(mousedownHandler, dragHandler, mouseupHandler) {
    dragAndDropEvent(this.#speakerProgressWrapper, {
      mousedown: mousedownHandler,
      mousemove: dragHandler,
      mouseup: mouseupHandler,
      touchstart: mousedownHandler,
      touchmove: dragHandler,
      touchend: mouseupHandler,
    });
  }

  addCloseInstructionHandler(handler) {
    [
      this.#instructionWrapper,
      this.#instructionCloseButton,
      this.#instructionOkayButton,
    ].forEach(element =>
      element.addEventListener('click', handler, { once: true })
    );

    this.#instruction.addEventListener('click', event =>
      event.stopPropagation()
    );
  }
}

export default new SubwebView();
