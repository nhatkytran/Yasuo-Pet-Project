'use strict';

const sliders = document.querySelectorAll('.skins_images__slider');
const rightButton = document.querySelector('.skins-btn__right');
const leftButton = document.querySelector('.skins-btn__left');

sliders.forEach((item, index) => {
  item.style.transform = `translateX(${(index - 2) * 100}%)`;
});

let nextRight = 3;
let nextLeft = 9;

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
});
