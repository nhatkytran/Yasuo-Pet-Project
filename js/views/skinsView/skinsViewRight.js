import { $, $$ } from '../../config.js';
import SkinsView from '../skinsView.js';

class SkinsViewRight extends SkinsView {
  _rightButton = $('.skins-btn__right');

  // constructor() {
  //   setInterval(() => {
  //     this._rightButton.click();
  //   }, 3000);
  // }

  handleGoRight(nameSkins) {
    // Remove first slide then Add last slide
    const slidersContainer = $('.skins_images');

    slidersContainer.removeChild(slidersContainer.firstElementChild);
    slidersContainer.insertAdjacentHTML(
      'beforeend',
      this._generateMarkup(this._nextRight)
    );

    // Move
    const sliders = $$('.skins_images__slider');

    sliders.forEach((item, index) => {
      item.style.transform = `translateX(${(index - 2) * 100}%)`;
    });
    this._logo.classList.add('dingdong');

    setTimeout(() => {
      this._logo.classList.remove('dingdong');
    }, 400);

    // Keep track
    this._nextRight++;
    this._nextLeft++;
    if (this._nextRight > 11) this._nextRight = 0;
    if (this._nextLeft > 11) this._nextLeft = 0;

    // Set name for and order for skin
    this._handleNameOrdered(nameSkins);
  }

  addHandlerGoRight(handler) {
    this._rightButton.addEventListener('click', () => {
      handler('right');
    });
  }
}

export default new SkinsViewRight();
