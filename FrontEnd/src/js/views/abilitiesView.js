import {
  ANIMATION_TIMEOUT,
  REM,
  ADD,
  REMOVE,
  LOADING,
  ERROR,
  CONTENT,
  SHOW,
} from '../config';

import {
  $,
  $_,
  $$,
  $$_,
  classRemove,
  intersectOneTime,
  mapMarkup,
  promisifyLoadingVideo,
} from '../utils';

class AbilitiesView {
  #skillsSection = $('.abilities__overlay');

  #skillsContainer = $('.ab__skills');
  #skills = $$('.ab__skills-skill');
  #skillCircle = $('.ab__skills-progress-circle');

  #skillWidth = 96;
  #skillWidthAdder = 41;

  #descriptionContentContainer = $('.ab__skills-desc-s');
  #descriptionContents;
  #descriptionLoading = $('.ab__skills-desc-loading');
  #descriptionError = $('.ab__skills-desc-error');
  #descriptionErrorButton = $_(this.#descriptionError, 'button');

  #videoContainer = $('.abilities__content-body-video');
  #videos;

  #playVideoButton = $('.abilities__play-video-button');

  constructor() {
    this.#skills.forEach((skill, index) =>
      skill.setAttribute('data-ab-skill', index)
    );
  }

  displayContent(state) {
    classRemove(
      ADD,
      this.#descriptionContentContainer,
      this.#descriptionLoading,
      this.#descriptionError
    );

    if (state === LOADING) classRemove(REMOVE, this.#descriptionLoading);
    if (state === ERROR) {
      classRemove(ADD, ...this.#videos);
      classRemove(REMOVE, this.#descriptionError);
    }
    if (state === CONTENT)
      classRemove(REMOVE, this.#descriptionContentContainer);
  }

  markSkillChosen(index, lastIndex) {
    const left = this.#skillWidth * index + this.#skillWidthAdder;
    this.#skillCircle.style.left = `${left / REM}rem`;
    this.#skills[lastIndex]?.classList.remove('active');
    this.#skills[index].classList.add('active');
  }

  markDescriptionChosen(index, lastIndex) {
    classRemove(ADD, this.#descriptionContents[lastIndex]);
    classRemove(REMOVE, this.#descriptionContents[index]);
  }

  markVideoChosen(index, lastIndex) {
    classRemove(ADD, this.#videos[lastIndex]);
    classRemove(REMOVE, this.#videos[index]);
  }

  controlVideoChosen = this.#controlVideoChosenFactory();
  #controlVideoChosenFactory() {
    let timeout;
    return (index, lastIndex) => {
      clearTimeout(timeout);
      this.#videos[lastIndex]?.pause();
      this.#videos[index].currentTime = 0;
      // setTimeout to fix error 'The play() request was interrupted by a call to pause().'
      // Sometimes this error can happen but the chance is really rare and don't affect the performance or break the website
      timeout = setTimeout(() => this.#videos[index].play(), ANIMATION_TIMEOUT);
    };
  }

  #generateVideoMarkup(videos, shownIndex) {
    const markupCallback = (_, index) => `
      <video class="abilities__content-body-video-s fade-in-500 ${
        shownIndex === index ? '' : 'remove'
      }">
        Your browser does not support video!
      </video>
    `;

    return mapMarkup(videos, markupCallback);
  }

  async createVideos(videos, shownIndex) {
    const markup = this.#generateVideoMarkup(videos, shownIndex);

    $$_(this.#videoContainer, '.abilities__content-body-video-s').forEach(
      element => element.remove()
    );
    this.#videoContainer.insertAdjacentHTML('afterbegin', markup);
    this.#videos = $$_(
      this.#videoContainer,
      '.abilities__content-body-video-s'
    );

    await Promise.all(
      videos.map((video, index) =>
        promisifyLoadingVideo(this.#videos[index], {
          mp4: video.mp4,
          webm: video.webm,
        })
      )
    );
  }

  #generateDescriptionMarkup(descriptions, shownIndex) {
    const markupCallback = (description, index) => `
      <div class="ab__skills-desc-s-content fade-in ${
        shownIndex === index ? '' : 'remove'
      }">
        <p class="ab__skills-desc-s-small">${description.small}</p>
        <h1 class="ab__skills-desc-s-big">${description.big}</h1>
        <p class="ab__skills-desc-s-medium">${description.medium}</p>
      </div>
    `;

    return mapMarkup(descriptions, markupCallback);
  }

  createDescriptions(descriptions, shownIndex) {
    const markup = this.#generateDescriptionMarkup(descriptions, shownIndex);

    this.#descriptionContentContainer.innerHTML = '';
    this.#descriptionContentContainer.insertAdjacentHTML('afterbegin', markup);

    this.#descriptionContents = $$_(
      this.#descriptionContentContainer,
      '.ab__skills-desc-s-content'
    );
  }

  displayPlayVideoButton = state =>
    classRemove(state === SHOW ? REMOVE : ADD, this.#playVideoButton);

  //
  // Events listening //////////

  addChooseSkillHander(handler) {
    this.#skillsContainer.addEventListener('click', event => {
      const target = event.target.closest('.ab__skills-skill');
      if (target) handler(Number(target.dataset.abSkill));
    });
  }

  addRefetchHandler(handler) {
    this.#descriptionErrorButton.addEventListener('click', () =>
      this.#skills.forEach(
        skill =>
          skill.classList.contains('active') &&
          handler(Number(skill.dataset.abSkill))
      )
    );
  }

  addPlayVideoFirstTimeHandler(handler) {
    this.#playVideoButton.addEventListener('click', handler, { once: true });
  }

  addIntersectionObserver(handler) {
    intersectOneTime(this.#skillsSection, { threshold: 0.3 }, handler);
  }
}

export default new AbilitiesView();
