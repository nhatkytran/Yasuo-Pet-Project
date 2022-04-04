import { $, $$ } from '../../config.js';
import SkinsView from '../skinsView.js';

class SkinsViewLeft extends SkinsView {
  _leftButton = document.querySelector('.skins-btn__left');

  handleGoLeft(nameSkins) {
    // Remove first slide then Add last slide
    const slidersContainer = $('.skins_images');

    slidersContainer.removeChild(slidersContainer.lastElementChild);
    slidersContainer.insertAdjacentHTML(
      'afterbegin',
      this._generateMarkup(this._nextLeft)
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
    this._nextLeft--;
    this._nextRight--;
    if (this._nextLeft < 0) this._nextLeft = 11;
    if (this._nextRight < 0) this._nextRight = 11;

    // Set name for and order for skin
    this._handleNameOrdered(nameSkins);
  }

  addHandlerGoLeft(handler) {
    this._leftButton.addEventListener('click', () => {
      handler('left');
    });
  }
}

export default new SkinsViewLeft();
