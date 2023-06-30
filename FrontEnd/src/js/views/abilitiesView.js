import { ADD, REMOVE, LOADING, ERROR, CONTENT } from '../config';
import { $, $$, classRemove } from '../utils';

class AbilitiesView {
  #skillsContainer;
  #skills;
  #skillCircle;

  #skillWidth = 9.6; // (rem) 96px for each skill (only displayed on PC)
  #skillWidthAdder = 4.1;

  #descriptionContents;
  #descriptionLoading;
  #descriptionError;

  constructor() {
    this.#skillsContainer = $('.ab__skills');
    this.#skills = $$('.ab__skills-skill');
    this.#skillCircle = $('.ab__skills-progress-circle');

    this.#descriptionContents = $('.ab__skills-desc-s');
    this.#descriptionLoading = $('.ab__skills-desc-loading');
    this.#descriptionError = $('.ab__skills-desc-error');

    this.#skills.forEach((skill, index) =>
      skill.setAttribute('data-ab-skill', index)
    );

    this.displayContent(CONTENT);
  }

  displayContent(state) {
    classRemove(
      ADD,
      this.#descriptionContents,
      this.#descriptionLoading,
      this.#descriptionError
    );

    if (state === LOADING) classRemove(REMOVE, this.#descriptionLoading);
    if (state === ERROR) classRemove(REMOVE, this.#descriptionError);
    if (state === CONTENT) classRemove(REMOVE, this.#descriptionContents);
  }

  markSkillChosen(index, lastIndex) {
    const left = this.#skillWidth * index + this.#skillWidthAdder;
    this.#skillCircle.style.left = `${left}rem`;

    if (lastIndex !== undefined)
      this.#skills[lastIndex].classList.remove('active');

    this.#skills[index].classList.add('active');
  }

  addChooseSkillHander(handler) {
    this.#skillsContainer.addEventListener('click', event => {
      const target = event.target.closest('.ab__skills-skill');

      if (!target) return;

      handler(Number(target.dataset.abSkill));
    });
  }
}

export default new AbilitiesView();
