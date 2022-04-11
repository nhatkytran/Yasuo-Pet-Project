import { $, $$ } from '../config.js';

import image0 from 'url:../../src/img/Skins/0.jpeg';
import image1 from 'url:../../src/img/Skins/1.jpeg';
import image2 from 'url:../../src/img/Skins/2.jpeg';
import image3 from 'url:../../src/img/Skins/3.jpeg';
import image4 from 'url:../../src/img/Skins/4.jpeg';
import image5 from 'url:../../src/img/Skins/5.jpeg';
import image6 from 'url:../../src/img/Skins/6.jpeg';
import image7 from 'url:../../src/img/Skins/7.jpeg';
import image8 from 'url:../../src/img/Skins/8.jpeg';
import image9 from 'url:../../src/img/Skins/9.jpeg';
import image10 from 'url:../../src/img/Skins/10.jpeg';
import image11 from 'url:../../src/img/Skins/11.jpeg';

import image0s from 'url:../../src/img/Skins/0s.jpg';
import image1s from 'url:../../src/img/Skins/1s.jpg';
import image2s from 'url:../../src/img/Skins/2s.jpg';
import image3s from 'url:../../src/img/Skins/3s.jpg';
import image4s from 'url:../../src/img/Skins/4s.jpg';
import image5s from 'url:../../src/img/Skins/5s.jpg';
import image6s from 'url:../../src/img/Skins/6s.jpg';
import image7s from 'url:../../src/img/Skins/7s.jpg';
import image8s from 'url:../../src/img/Skins/8s.jpg';
import image9s from 'url:../../src/img/Skins/9s.jpg';
import image10s from 'url:../../src/img/Skins/10s.jpg';
import image11s from 'url:../../src/img/Skins/11s.jpg';

const images = [
  image0,
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  image10,
  image11,
];

const imagesMobile = [
  image0s,
  image1s,
  image2s,
  image3s,
  image4s,
  image5s,
  image6s,
  image7s,
  image8s,
  image9s,
  image10s,
  image11s,
];

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
        style="background-image: url(${images[index]}); transform: translateX(0)"
      ></div>
    `;
  }

  _generateMarkupMobile(index) {
    return `
      <div
        class="skins_images-mobile__slider"
        style="background-image: url(${imagesMobile[index]})"
      ></div>
    `;
  }

  _handleNameOrdered(nameSkins) {
    // Name
    this._nameSkinsContainer.innerHTML = '';
    this._nameSkinsContainer.insertAdjacentHTML(
      'afterbegin',
      `<h1 class="skins_overlay__about-who-name">${
        nameSkins[this._currentSkins]
      }</h1>`
    );

    // Ordered
    const orderedNumber = this._currentSkins + 1;

    this._orderedSkinContainer.textContent = orderedNumber;

    // Name on mobile
    this._nameSkinsContainerMobile.innerHTML = '';
    this._nameSkinsContainerMobile.insertAdjacentHTML(
      'afterbegin',
      `<h1 class="skins_overlay__mobile-name">${
        nameSkins[this._currentSkins]
      }</h1>`
    );
  }
}

export default SkinsView;
