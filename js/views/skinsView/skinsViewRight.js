import { $, $$ } from '../../config.js';
import SkinsView from '../skinsView.js';

class SkinsViewRight extends SkinsView {
  _rightButton = $('.skins-btn__right');
  _rightMobileButton = $('.skins_overlay__mobile--right');

  // constructor() {
  //   setInterval(() => {
  //     this._rightButton.click();
  //   }, 3000);
  // }

  handleGoRight(nameSkins) {
    // Remove first slide then Add last slide //
    // PC
    const slidersContainer = $('.skins_images');

    slidersContainer.removeChild(slidersContainer.firstElementChild);
    slidersContainer.insertAdjacentHTML(
      'beforeend',
      this._generateMarkup(this._nextRight)
    );

    // Mobile
    const slidersContainerMobile = $('.skins_images-mobile');

    slidersContainerMobile.removeChild(
      slidersContainerMobile.firstElementChild
    );
    slidersContainerMobile.insertAdjacentHTML(
      'beforeend',
      this._generateMarkupMobile(this._nextRight)
    );

    // Move //
    // PC // Mobile
    const sliders = $$('.skins_images__slider');
    const slidersMobile = $$('.skins_images-mobile__slider');

    [sliders, slidersMobile].forEach(slider =>
      slider.forEach((item, index) => {
        item.style.transform = `translateX(${(index - 2) * 100}%)`;
      })
    );

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
    [this._rightButton, this._rightMobileButton].forEach(button => {
      button.addEventListener('click', function () {
        handler('right');
      });
    });
  }
}

export default new SkinsViewRight();
