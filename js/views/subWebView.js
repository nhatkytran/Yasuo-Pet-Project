import { $ } from '../config.js';

class SubWebView {
  _parentElement = $('.container');
  smallVideo = $('.trailer__bg-small-video');
  bigVideo = $('.trailer__bg-big-video');

  addHandlerPlay(handler) {
    setTimeout(() => {
      handler(this.smallVideo, this.bigVideo);
    }, 3000);
  }

  addHandlerStop(handler) {
    this.smallVideo.addEventListener('ended', function () {
      handler();
    });
  }

  addBackgroundStar() {
    this._parentElement.insertAdjacentHTML('beforeend', this._starMarkup());
  }

  _starMarkup() {
    return `
      <div id="stars"></div>
    `;
  }
}

export default new SubWebView();
