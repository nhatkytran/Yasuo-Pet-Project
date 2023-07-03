import { ADD, REMOVE, LOADING, ERROR, CONTENT } from '../config';
import { $, $_, $$, $$_, classRemove, mapMarkup } from '../utils';

class AbilitiesView {
  #skillsContainer;
  #skills;
  #skillCircle;

  #skillWidth = 9.6; // (rem) 96px for each skill (only displayed on PC)
  #skillWidthAdder = 4.1;

  #descriptionContentContainer;
  #descriptionContents;
  #descriptionLoading;
  #descriptionError;
  #descriptionErrorButton;

  constructor() {
    this.#skillsContainer = $('.ab__skills');
    this.#skills = $$('.ab__skills-skill');
    this.#skillCircle = $('.ab__skills-progress-circle');

    this.#descriptionContentContainer = $('.ab__skills-desc-s');
    // this.#descriptionContents; // No contents created at this time except for the default one
    this.#descriptionLoading = $('.ab__skills-desc-loading');
    this.#descriptionError = $('.ab__skills-desc-error');
    this.#descriptionErrorButton = $_(this.#descriptionError, 'button');

    this.#skills.forEach((skill, index) =>
      skill.setAttribute('data-ab-skill', index)
    );

    this.displayContent(CONTENT);
  }

  displayContent(state) {
    classRemove(
      ADD,
      this.#descriptionContentContainer,
      this.#descriptionLoading,
      this.#descriptionError
    );

    if (state === LOADING) classRemove(REMOVE, this.#descriptionLoading);
    if (state === ERROR) classRemove(REMOVE, this.#descriptionError);
    if (state === CONTENT)
      classRemove(REMOVE, this.#descriptionContentContainer);
  }

  markSkillChosen(index, lastIndex) {
    const left = this.#skillWidth * index + this.#skillWidthAdder;
    this.#skillCircle.style.left = `${left}rem`;

    if (lastIndex !== undefined)
      this.#skills[lastIndex].classList.remove('active');

    this.#skills[index].classList.add('active');
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

  markDescriptionChosen(index, lastIndex) {
    classRemove(ADD, this.#descriptionContents[lastIndex]);
    classRemove(REMOVE, this.#descriptionContents[index]);
  }

  addChooseSkillHander(handler) {
    this.#skillsContainer.addEventListener('click', event => {
      const target = event.target.closest('.ab__skills-skill');

      if (!target) return;

      handler(Number(target.dataset.abSkill));
    });
  }

  addReFetchHandler(handler) {
    this.#descriptionErrorButton.addEventListener('click', handler);
  }
}

export default new AbilitiesView();
