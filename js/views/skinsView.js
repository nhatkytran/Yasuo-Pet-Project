import { $, $$ } from '../config.js';

class SkinsView {
  _logo = $('.skins_container__header-logo');
  _currentSkins = 0;
  _nextRight = 3;
  _nextLeft = 9;

  // PC
  _sliders = $$('.skins_images__slider');
  _nameSkinsContainer = $('.skins_overlay__about-who');
  _orderedSkinContainer = $('.skin-ordered-number');
  _orderedNumber = 1;

  // Mobile
  _slidersMobile = $$('.skins_images-mobile__slider');
  _nameSkinsContainerMobile = $('.skins_overlay__mobile-name-container');

  constructor() {
    const skinsDefaultPosition = function (element) {
      element.forEach((item, index) => {
        item.style.transform = `translateX(${(index - 2) * 100}%)`;
      });
    };

    // PC
    skinsDefaultPosition(this._sliders);

    // Mobile
    skinsDefaultPosition(this._slidersMobile);
  }

  _generateMarkup(index) {
    return `
      <div
        class="skins_images__slider"
        style="background-image: url('../../src/img/Skins/${index}.jpeg'); transform: translateX(0)"
      ></div>
    `;
  }

  _generateMarkupMobile(index) {
    return `
      <div
        class="skins_images-mobile__slider"
        style="background-image: url('../../src/img/Skins/${index}s.jpg')"
      ></div>
    `;
  }

  _handleNameOrdered(nameSkins) {
    // console.log(newSliders[2].getAttribute('style'));
    // background-image: url("../../src/img/Skins/1.jpeg"); transform: translateX(0%);

    // console.log(newSliders[2].getAttribute('style').split(' ')[1]);
    // url('../../src/img/Skins/1.jpeg');

    // console.log(newSliders[2].getAttribute('style').split(' ')[1].slice(25, 27));
    // 1;
    const newSliders = $$('.skins_images__slider');
    const currentSkins = Number(
      newSliders[2]
        .getAttribute('style')
        .split(' ')[1]
        .slice(25, 27)
        .replace('.', '')
    );

    // Name
    this._nameSkinsContainer.innerHTML = '';
    this._nameSkinsContainer.insertAdjacentHTML(
      'afterbegin',
      `<h1 class="skins_overlay__about-who-name">${nameSkins[currentSkins]}</h1>`
    );

    // Ordered
    const orderedNumber = currentSkins + 1;

    this._orderedSkinContainer.textContent = orderedNumber;

    // Name on mobile
    this._nameSkinsContainerMobile.innerHTML = '';
    this._nameSkinsContainerMobile.insertAdjacentHTML(
      'afterbegin',
      `<h1 class="skins_overlay__mobile-name">${nameSkins[currentSkins]}</h1>`
    );
  }
}

export default SkinsView;
