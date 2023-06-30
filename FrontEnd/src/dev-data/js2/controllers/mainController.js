'use strict';

import { $, $$ } from '../config';

const state = {
  abilitiesData: {},
};

const skillsContainer = $('.ab__skills');
const skills = $$('.ab__skills-skill');
const skillCircle = $('.ab__skills-progress-circle');

skills.forEach((skill, index) => skill.setAttribute('data-ab-skill', index));

const skillWidth = 9.6; // (rem) 96px for each skill (only displayed on PC)
const skillWidthAdder = 4.1;

let lastSkillChosen;

skillsContainer.addEventListener('click', event => {
  const target = event.target.closest('.ab__skills-skill');

  if (!target) return;

  const index = Number(target.dataset.abSkill);

  handleSkillChosen(index);

  // Abort fetching

  // Check to start fetching again
});

function handleSkillChosen(index) {
  skillCircle.style.left = `${skillWidth * index + skillWidthAdder}rem`;

  if (lastSkillChosen !== undefined)
    skills[lastSkillChosen].classList.remove('active');

  lastSkillChosen = index;
  skills[index].classList.add('active');
}

function handleDescription(index) {}

function handleVideo(index) {}
