import { $, $$, $_, $$_ } from '../config';

class SubwebView {
  #fetchButton = $('.trailer__play-video-play');
  #fetchLoading = $('.trailer__play-video-loading');
  #fetchSuccess = $('.trailer__play-video-success');
  #fetchMessage = $('.trailer__play-video-message');

  // #handleErrorMessage(message) {
  //   $_(this.#fetchMessage, 'p').textContent = message;
  // }

  renderUI(state) {
    switch (state) {
      case 'start':
        break;
      case 'end':
        break;
      default:
        throw new Error('Invalid state!');
    }
  }

  renderError(state) {}

  addFetchVideoHandler(handler) {
    [this.#fetchButton, $_(this.#fetchMessage, 'span')].forEach(buttonEl =>
      buttonEl.addEventListener('click', handler)
    );
  }
}

export default new SubwebView();
