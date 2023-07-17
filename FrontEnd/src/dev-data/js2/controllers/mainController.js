'use strict';

import { $, $$ } from '../../../js/utils';

const slider = $('.skins2-slider');
const slideItems = $$('.skins2-slider-item');
const slideButtons = $$('.skins2-button');

slideButtons.forEach((button, index) => {
  button.setAttribute('data-slide-button-index', index);
});

let prevIndex = 1; // By default, index of 1 is active

slider.addEventListener('click', event => {
  const target = event.target.closest('.skins2-button');

  if (!target) return;

  const index = Number(target.dataset.slideButtonIndex);

  slide(index);
  slideAnimate(prevIndex, index);

  prevIndex = index;

  console.log(index);
});

function slide(currentIndex) {
  const shouldIndex = (currentIndex - 1) * -100;

  slideItems.forEach(slideItem => {
    slideItem.style.transform = `translateY(${shouldIndex}%)`;
  });
}

function slideAnimate(prevIndex, currentIndex) {
  if (prevIndex !== null) slideButtons[prevIndex].classList.remove('active');
  slideButtons[currentIndex].classList.add('active');
}
