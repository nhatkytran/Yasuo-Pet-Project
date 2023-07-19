'use strict';

import { $, $$ } from '../../../js/utils';

// const slider = $('.skins2-slider');
// const sliderList = $('.skins2-slider-list');
// const slideItems = $$('.skins2-slider-item');
// const slideButtons = $$('.skins2-button');

// const { height: slideItemHeight } = slideItems[0].getBoundingClientRect();

// slideButtons.forEach((button, index) => {
//   button.setAttribute('data-slide-button-index', index);
// });

// let prevIndex = 1; // By default, index of 1 is active
// let currentTranslateY = 0; // `rem` unit

// slider.addEventListener('click', event => {
//   if (isDragged) return;

//   const target = event.target.closest('.skins2-button');

//   if (!target) return;

//   const index = Number(target.dataset.slideButtonIndex);

//   currentTranslateY = ((index - 1) * -slideItemHeight) / 10;

//   slide(currentTranslateY);
//   slideAnimate(index);

//   prevIndex = index;
// });

// function slide(translateY) {
//   sliderList.style.transform = `translateY(${translateY}rem)`;
// }

// function slideAnimate(index) {
//   slideButtons[prevIndex].classList.remove('active');
//   slideButtons[index].classList.add('active');
// }

// let isDragged = false; // if true --> prevent `click` event
// let isReadyToDrag = false;
// let oldClientY;
// let newClientY;

// const totalItems = 11; // Count after fetching data

// function dragStart(event) {
//   isReadyToDrag = true;
//   oldClientY = event.clientY;
// }

// function dragProgress(event) {
//   if (!isReadyToDrag) return;

//   isDragged = true;
//   newClientY = event.clientY;

//   const diff = newClientY - oldClientY;

//   if (diff !== 0) slide(currentTranslateY + diff / 10);
// }

// function dragStop() {
//   isReadyToDrag = false;
//   isDragged = false; // `click` event before `mouseup` event

//   currentTranslateY += (newClientY - oldClientY) / 10; // `rem` unit

//   if (currentTranslateY > 10) currentTranslateY = 10;
//   if (currentTranslateY < -(totalItems - 2) * 10)
//     currentTranslateY = -(totalItems - 2) * 10;

//   currentTranslateY = Math.round(currentTranslateY / 10) * 10;

//   slide(currentTranslateY);
// }

// slider.addEventListener('mousedown', dragStart);
// slider.addEventListener('mousemove', dragProgress);
// slider.addEventListener('mouseup', dragStop);
// slider.addEventListener('mouseleave', dragStop);

// Mobile //////////

const slider = $('.skins2-mobile-slider');
const sliderList = $('.skins2-mobile-slider__list');
const sliderItems = $$('.skins2-mobile-slider__item');

const { width: sliderWidth } = slider.getBoundingClientRect();
const { width: sliderItemWidth } = sliderItems[0].getBoundingClientRect();

sliderItems.forEach((item, index) => {
  item.setAttribute('data-slide-item-index', index);
});

let prevIndex = 1;
let currentTranslateX;

function countTranslateX(index) {
  return (sliderWidth / 2 - sliderItemWidth * (index + 1 / 2)) / 10;
}

function slide(translateX) {
  sliderList.style.transform = `translateX(${translateX}rem)`;
}

let currentTranslateXDefault = countTranslateX(1);

// currentTranslateX changes when drag
// currentTranslateXDefault is used to hold the default value (changes with `resize` event)

currentTranslateX = currentTranslateXDefault;
slide(currentTranslateX);

function slideAnimate(index) {
  sliderItems[prevIndex].classList.remove('active');
  sliderItems[index].classList.add('active');
}

slider.addEventListener('click', event => {
  const target = event.target.closest('.skins2-mobile-slider__item');

  if (!target) return;

  const index = Number(target.dataset.slideItemIndex);

  currentTranslateX = countTranslateX(index);

  slide(currentTranslateX);
  slideAnimate(index);

  prevIndex = index;
});

let isDragged = false; // if true --> prevent `click` event
let isReadyToDrag = false;
let oldClientX;
let newClientX;

const totalItems = 11; // Count after fetching data

function dragStart(event) {
  isReadyToDrag = true;
  oldClientX = event.clientX || event.touches[0].clientX;
}

function dragProgress(event) {
  if (!isReadyToDrag) return;

  isDragged = true;
  newClientX = event.clientX || event.touches[0].clientX;

  const diff = newClientX - oldClientX;

  if (diff !== 0) slide(currentTranslateX + diff / 10);
}

function dragStop() {
  isReadyToDrag = false;
  isDragged = false; // `click` event before `mouseup` event

  currentTranslateX += (newClientX - oldClientX) / 10; // `rem` unit

  // if ((currentTranslateX > currentTranslateXDefault - sliderItemWidth) / 10)
  //   currentTranslateX = (currentTranslateXDefault - sliderItemWidth) / 10;
  // if (currentTranslateY < -(totalItems - 2) * 10)
  //   currentTranslateY = -(totalItems - 2) * 10;

  // currentTranslateY = Math.round(currentTranslateY / 10) * 10;

  // slide(currentTranslateX);
}

slider.addEventListener('mousedown', dragStart);
slider.addEventListener('mousemove', dragProgress);
slider.addEventListener('mouseup', dragStop);
slider.addEventListener('mouseleave', dragStop);

slider.addEventListener('touchstart', dragStart, { passive: true });
slider.addEventListener('touchmove', dragProgress, { passive: true });
slider.addEventListener('touchend', dragStop);

// Resize
