'use strict';

import { $, $$ } from '../../../js/utils';

const slider = $('.skins2-slider');
const sliderList = $('.skins2-slider-list');
const slideItems = $$('.skins2-slider-item');
const slideButtons = $$('.skins2-button');

slideButtons.forEach((button, index) => {
  button.setAttribute('data-slide-button-index', index);
});

let isDragged = false; // if true --> prevent `click` event
let isReadyToDrag = false;
let oldClientY;
let newClientY;

function dragStart(event) {
  isReadyToDrag = true;
  oldClientY = event.clientY;
}

function dragProgress(event) {
  if (!isReadyToDrag) return;
  console.log(currentPercent);

  isDragged = true;
  newClientY = event.clientY;

  const diff = newClientY - oldClientY;

  if (diff === 0) return;

  // dif > 0 and diff < 0
  slideItems.forEach(slideItem => {
    slideItem.style.transform = `translateY(${currentPercent + diff}%)`;
  });
}

function dragStop(event) {
  isReadyToDrag = false;

  // `mouseup` <--> `click`
  // Handle isDragged with `mousedown` (`click` set isDragged to false by itself)
  if (event.type === 'mouseleave') isDragged = false;

  // Adjust currentPercent and Position
  currentPercent += newClientY - oldClientY;

  if (currentPercent > 100) currentPercent = 100;

  // <

  slideItems.forEach(slideItem => {
    slideItem.style.transform = `translateY(${currentPercent}%)`;
  });
}

sliderList.addEventListener('mousedown', dragStart);
sliderList.addEventListener('mousemove', dragProgress);
sliderList.addEventListener('mouseup', dragStop);
sliderList.addEventListener('mouseleave', dragStop);

let prevIndex = 1; // By default, index of 1 is active
let currentIndex = 1;
let currentPercent = (currentIndex - 1) * -100;

slider.addEventListener('click', event => {
  if (isDragged) return (isDragged = false);

  const target = event.target.closest('.skins2-button');

  if (!target) return;

  const index = Number(target.dataset.slideButtonIndex);

  currentIndex = index;

  slide();
  slideAnimate();

  prevIndex = index;
});

function slide() {
  currentPercent = (currentIndex - 1) * -100;

  slideItems.forEach(slideItem => {
    slideItem.style.transform = `translateY(${currentPercent}%)`;
  });
}

function slideAnimate() {
  if (prevIndex !== null) slideButtons[prevIndex].classList.remove('active');
  slideButtons[currentIndex].classList.add('active');
}
