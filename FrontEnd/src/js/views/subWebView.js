import { $, $$, $_, $$_ } from '../config';

class SubwebView {
  #fetchButton = $('.trailer__play-video-play');
  #fetchLoading = $('.trailer__play-video-loading');
  #fetchSuccess = $('.trailer__play-video-success');
  #fetchMessage = $('.trailer__play-video-message');
  #errorMessageCommon = 'Something went wrong!';
  #errorMessageTimeout = 'Timeout aborts!';
  #errorMessageUserAction = 'User aborts!';

  #displayControlPanel(currentPanel) {
    [
      this.#fetchButton,
      this.#fetchLoading,
      this.#fetchSuccess,
      this.#fetchMessage,
    ].forEach(panel => panel.classList.add('remove'));
    currentPanel.classList.remove('remove');
  }

  renderUI(state) {
    switch (state) {
      case 'start':
        this.#resetErrorMessage();
        this.#displayControlPanel(this.#fetchLoading);
        break;
      case 'end':
        break;
      default:
        throw new Error("Invalid renderUI's state!");
    }
  }

  #handleErrorMessage(message) {
    $_(this.#fetchMessage, 'p').textContent = message;
  }

  #resetErrorMessage() {
    this.#handleErrorMessage(this.#errorMessageCommon);
  }

  renderError(state) {}

  addFetchVideoHandler(handler) {
    [this.#fetchButton, $_(this.#fetchMessage, 'span')].forEach(buttonEl =>
      buttonEl.addEventListener('click', handler)
    );
  }
}

export default new SubwebView();
