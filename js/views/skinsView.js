import { $, $$ } from '../config.js';

class SkinsView {
  _sliders = $$('.skins_images__slider');
  _logo = $('.skins_container__header-logo');
  _currentSkins = 0;
  _orderedNumber = 1;
  _nameSkinsContainer = document.querySelector('.skins_overlay__about-who');
  _orderedSkinContainer = document.querySelector('.skin-ordered-number');
  _nextRight = 3;
  _nextLeft = 9;

  constructor() {
    this._sliders.forEach((item, index) => {
      item.style.transform = `translateX(${(index - 2) * 100}%)`;
    });
  }

  _generateMarkup(index) {
    return `
      <div
        class="skins_images__slider"
        style="background-image: url('../../src/img/Skins/${index}.jpeg'); transform: translateX(0)"
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
    const currentSkins = +newSliders[2]
      .getAttribute('style')
      .split(' ')[1]
      .slice(25, 27)
      .replace('.', '');

    this._nameSkinsContainer.innerHTML = '';
    this._nameSkinsContainer.insertAdjacentHTML(
      'afterbegin',
      `<h1 class="skins_overlay__about-who-name">${nameSkins[currentSkins]}</h1>`
    );

    // Ordered
    const orderedNumber = currentSkins + 1;
    this._orderedSkinContainer.textContent = orderedNumber;
  }
}

export default SkinsView;
