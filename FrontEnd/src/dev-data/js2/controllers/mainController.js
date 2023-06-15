import { ADD, CONTENT, ERROR, LOADING, NONE, REMOVE } from '../../../js/config';
import { $, $$, $_, classRemove } from '../../../js/helpers';

const mainBody = $('.explore-games__body');
const mainBtn = $('.main-header__games');

mainBtn.addEventListener('click', () => {
  console.log('Open');
});

const posters = $$('.explore-games__body-poster');
const links = $$('.eg-poster');
const loadings = $$('.eg-poster-loading');
const loadingError = document.querySelector('.explore-games__body-error');

links.forEach(link =>
  link.addEventListener('click', function (event) {
    if (this.classList.contains('loading')) event.preventDefault();
  })
);

const displayContent = state => {
  if (state === NONE || state === ERROR) {
    posters.forEach((poster, index) => {
      // Can not use class `remove`, we need to keep images to remain size of the sidebar
      poster.classList.add('hide');
      links[index].classList.remove('loading');
      classRemove(ADD, loadings[index]);
    });

    classRemove(state === NONE ? ADD : REMOVE, loadingError);
  }

  if (state === LOADING) {
    classRemove(ADD, loadingError);

    posters.forEach((poster, index) => {
      // Can not use class `remove`, we need to keep images to remain size of the sidebar
      poster.classList.remove('hide');
      links[index].classList.add('loading');
      classRemove(REMOVE, loadings[index]);
    });
  }

  if (state === CONTENT) {
    posters.forEach((poster, index) => {
      // Can not use class `remove`, we need to keep images to remain size of the sidebar
      poster.classList.remove('hide');
      links[index].classList.remove('loading');
      classRemove(ADD, loadings[index]);
    });
  }
};

// displayContent(NONE);
// displayContent(ERROR);
// displayContent(LOADING);
// displayContent(CONTENT);
