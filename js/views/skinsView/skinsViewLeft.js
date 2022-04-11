import { $, $$ } from '../../config.js';
import SkinsView from '../skinsView.js';

class SkinsViewLeft extends SkinsView {
  _leftButton = $('.skins-btn__left');
  _leftMobileButton = $('.skins_overlay__mobile--left');

  handleGoLeft(nameSkins) {
    // Remove first slide then Add last slide //
    // PC
    const slidersContainer = $('.skins_images');

    slidersContainer.removeChild(slidersContainer.lastElementChild);
    slidersContainer.insertAdjacentHTML(
      'afterbegin',
      this._generateMarkup(this._nextLeft)
    );

    // Mobile
    const slidersContainerMobile = $('.skins_images-mobile');

    slidersContainerMobile.removeChild(slidersContainerMobile.lastElementChild);
    slidersContainerMobile.insertAdjacentHTML(
      'afterbegin',
      this._generateMarkupMobile(this._nextLeft)
    );

    // Move //
    // PC // Mobile
    const sliders = $$('.skins_images__slider');
    const slidersMobile = $$('.skins_images-mobile__slider');

    [sliders, slidersMobile].forEach(slider => {
      slider.forEach((item, index) => {
        item.style.transform = `translateX(${(index - 2) * 100}%)`;
      });
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
    this._currentSkins -= 1;
    if (this._currentSkins < 0) this._currentSkins = 11;

    this._handleNameOrdered(nameSkins);
  }

  addHandlerGoLeft(handler) {
    [this._leftButton, this._leftMobileButton].forEach(button => {
      button.addEventListener('click', () => {
        handler('left');
      });
    });
  }
}

export default new SkinsViewLeft();
