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
//   if (event.type === 'mouseleave' && !isDragged) return;

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

const skinsImageWrapper = $('.skins2-img-wrapper');
const slider = $('.skins2-mobile-slider');
const sliderList = $('.skins2-mobile-slider__list');
const sliderItems = $$('.skins2-mobile-slider__item');

// width of `slider is equal to width of `skinsImageWrapper`
// but `slider` can be display none at sometimes
// so we use width of `skinsImageWrapper`
let { width: sliderWidth } = skinsImageWrapper.getBoundingClientRect();

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

// currentTranslateX changes when drag
// currentTranslateXDefault is used to hold the default value (changes with `resize` event)
let currentTranslateXDefault = countTranslateX(1);

currentTranslateX = currentTranslateXDefault;
slide(currentTranslateX);

// Resize
window.addEventListener('resize', () => {
  sliderWidth = skinsImageWrapper.getBoundingClientRect().width;
  currentTranslateXDefault = countTranslateX(1);

  const pointDefault = currentTranslateXDefault + sliderItemWidth / 10;
  const middle = sliderItemWidth / 10 / 2; // `rem` unit

  if (Math.abs(pointDefault - currentTranslateX) < middle)
    currentTranslateX = pointDefault;

  // translateX for left indices (excludes index 0)
  for (let i = 0; i < totalItems - 1; i++) {
    const translateX = currentTranslateXDefault - (i * sliderItemWidth) / 10;

    if (Math.abs(translateX - currentTranslateX) < middle)
      currentTranslateX = translateX;
  }

  slide(currentTranslateX);
});

function slideAnimate(index) {
  sliderItems[prevIndex].classList.remove('active');
  sliderItems[index].classList.add('active');
}

slider.addEventListener('click', event => {
  if (isDragged) return;

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

function dragStop(event) {
  if (event.type === 'mouseleave' && !isDragged) return;

  isReadyToDrag = false;
  isDragged = false; // `click` event before `mouseup` event

  currentTranslateX += (newClientX - oldClientX) / 10; // `rem` unit

  // It is like when index = 0, but we choose index = 1 is default
  // so we need to plus 1 `sliderItemWidth`
  const pointDefault = currentTranslateXDefault + sliderItemWidth / 10;
  const limitAfter = -(
    (sliderItemWidth / 10) * (totalItems - 1) -
    pointDefault
  );

  if (currentTranslateX > pointDefault) currentTranslateX = pointDefault;
  if (currentTranslateX < limitAfter) currentTranslateX = limitAfter;

  // translateX for index 0 --> pointDefault
  const middle = sliderItemWidth / 10 / 2; // `rem` unit

  if (Math.abs(pointDefault - currentTranslateX) < middle)
    currentTranslateX = pointDefault;

  // translateX for left indices (excludes index 0)
  for (let i = 0; i < totalItems - 1; i++) {
    const translateX = currentTranslateXDefault - (i * sliderItemWidth) / 10;

    if (Math.abs(translateX - currentTranslateX) < middle)
      currentTranslateX = translateX;
  }

  slide(currentTranslateX);
}

slider.addEventListener('mousedown', dragStart);
slider.addEventListener('mousemove', dragProgress);
slider.addEventListener('mouseup', dragStop);
slider.addEventListener('mouseleave', dragStop);

slider.addEventListener('touchstart', dragStart, { passive: true });
slider.addEventListener('touchmove', dragProgress, { passive: true });
slider.addEventListener('touchend', dragStop);
