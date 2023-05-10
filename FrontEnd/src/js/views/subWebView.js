import { $, $$, $_, $$_, BACKEND_URL } from '../config';

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

  playVideo() {
    this.#trailerImage.classList.add('hide');
    this.renderUI('end');
  }

  renderUI(state) {
    if (state === 'start') {
      this.#resetErrorMessage();
      this.#displayControlPanel(this.#fetchLoading);
    }
    if (state === 'end') this.#displayControlPanel(this.#fetchSuccess);
  }

  #resetErrorMessage() {
    this.#handleErrorMessage(this.#errorMessageCommon);
  }

  #handleErrorMessage(message) {
    $_(this.#fetchMessage, 'p').textContent = message;
  }

  renderError(error) {
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout'))
      this.#handleErrorMessage(this.#errorMessageTimeout);
    if (error.code === 'ERR_CANCELED' && error.message.includes('canceled'))
      this.#handleErrorMessage(this.#errorMessageUserAction);

    this.#displayControlPanel(this.#fetchMessage);
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
}

export default new SubwebView();
