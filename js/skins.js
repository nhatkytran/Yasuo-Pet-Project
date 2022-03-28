'use strict';

const sliders = document.querySelectorAll('.skins_images__slider');
const rightButton = document.querySelector('.skins-btn__right');
const leftButton = document.querySelector('.skins-btn__left');

const nameSkinsContainer = document.querySelector('.skins_overlay__about-who');
const orderedSkinContainer = document.querySelector('.skin-ordered-number');

const nameSkins = [
  'YASUO',
  'HIGH NOON YASUO',
  'PROJECT: YASUO',
  'BLOOD MOON YASUO',
  'NIGHTBRINGER YASUO',
  'ODYSSEY YASUO',
  'BATTLE BOSS YASUO',
  'TRUE DAMAGE YASUO',
  'TRUE DAMAGE YASUO PRESTIGE EDITION',
  'SPIRIT BLOSSOM YASUO',
  'TRUTH DRAGON YASUO',
  'DREAM DRAGON YASUO',
];

sliders.forEach((item, index) => {
  item.style.transform = `translateX(${(index - 2) * 100}%)`;
});

let nextRight = 3;
let nextLeft = 9;

let currentSkins = 0;
let orderedNumber = 1;

// There are 5 images in default
// There are 12 images in total (index from 0 to 1 (name: [index].jpeg)])
rightButton.addEventListener('click', function () {
  // Remove
  const slidersContainer = document.querySelector('.skins_images');
  slidersContainer.removeChild(slidersContainer.firstElementChild);

  // Add
  const markup = `
    <div
      class="skins_images__slider"
      style="background-image: url('../../src/img/Skins/${nextRight}.jpeg'); transform: translateX(0)"
    ></div>
  `;
  slidersContainer.insertAdjacentHTML('beforeend', markup);

  // Move
  const sliders = document.querySelectorAll('.skins_images__slider');
  sliders.forEach((item, index) => {
    item.style.transform = `translateX(${(index - 2) * 100}%)`;
  });

  // Keep track
  nextRight = nextRight + 1;
  nextLeft = nextLeft + 1;

  if (nextRight > 11) {
    nextRight = 0;
  }

  if (nextLeft > 11) {
    nextLeft = 0;
  }

  // Set name for and order for skin
  handleNameAndOrder();
});

leftButton.addEventListener('click', function () {
  // Remove
  const slidersContainer = document.querySelector('.skins_images');
  slidersContainer.removeChild(slidersContainer.lastElementChild);

  // Add
  const markup = `
    <div
      class="skins_images__slider"
      style="background-image: url('../../src/img/Skins/${nextLeft}.jpeg'); transform: translateX(0)"
    ></div>
  `;
  slidersContainer.insertAdjacentHTML('afterbegin', markup);

  // Move
  const sliders = document.querySelectorAll('.skins_images__slider');
  sliders.forEach((item, index) => {
    item.style.transform = `translateX(${(index - 2) * 100}%)`;
  });

  // Keep track
  nextLeft = nextLeft - 1;
  nextRight = nextRight - 1;

  if (nextLeft < 0) {
    nextLeft = 11;
  }

  if (nextRight < 0) {
    nextRight = 11;
  }

  // Set name for and order for skin
  handleNameAndOrder();
});

function handleNameAndOrder() {
  const newSliders = document.querySelectorAll('.skins_images__slider');
  // console.log(newSliders[2].getAttribute('style'));
  // background-image: url("../../src/img/Skins/1.jpeg"); transform: translateX(0%);

  // console.log(newSliders[2].getAttribute('style').split(' ')[1]);
  // url('../../src/img/Skins/1.jpeg');

  // console.log(newSliders[2].getAttribute('style').split(' ')[1].slice(25, 27));
  // 1;

  // Name
  const currentSkins = +newSliders[2]
    .getAttribute('style')
    .split(' ')[1]
    .slice(25, 27)
    .replace('.', '');

  nameSkinsContainer.innerHTML = '';
  nameSkinsContainer.insertAdjacentHTML(
    'afterbegin',
    `<h1 class="skins_overlay__about-who-name">${nameSkins[currentSkins]}</h1>`
  );

  // Ordered
  const orderedNumber = currentSkins + 1;
  orderedSkinContainer.textContent = orderedNumber;
}

// setInterval(function () {
//   rightButton.click();
// }, 3000);
