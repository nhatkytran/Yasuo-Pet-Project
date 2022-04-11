import { $, $$ } from '../config.js';

import videoMp40 from 'url:../../src/img/Skills/0.mp4';
import videoWebm0 from 'url:../../src/img/Skills/0.webm';

import videoMp41 from 'url:../../src/img/Skills/1.mp4';
import videoWebm1 from 'url:../../src/img/Skills/1.webm';

import videoMp42 from 'url:../../src/img/Skills/2.mp4';
import videoWebm2 from 'url:../../src/img/Skills/2.webm';

import videoMp43 from 'url:../../src/img/Skills/3.mp4';
import videoWebm3 from 'url:../../src/img/Skills/3.webm';

import videoMp44 from 'url:../../src/img/Skills/4.mp4';
import videoWebm4 from 'url:../../src/img/Skills/4.webm';

const videosMp4 = [videoMp40, videoMp41, videoMp42, videoMp43, videoMp44];
const videosWebm = [videoWebm0, videoWebm1, videoWebm2, videoWebm3, videoWebm4];

class AbilitiesView {
  _parentElement = $('.ab__skills');
  _skills = $$('.ab__skills-skill');
  _skillCircle = $('.ab__skills-progress-circle');
  _skillDesc = $('.ab__skills-desc');
  _videoContainer = $('.abilities__content-body-video');

  constructor() {
    this._skills.forEach((skill, index) =>
      skill.setAttribute('data-skill-number', index)
    );
  }

  _generateMarkupDesc(index, skillsDetail) {
    const skill = skillsDetail[index];

    return `
    <div class="ab__skills-desc-s">
      <p class="ab__skills-desc-s-small">${skill.button}</p>
      <h1 class="ab__skills-desc-s-big">${skill.name}</h1>
      <p class="ab__skills-desc-s-medium">
        ${skill.desc}
      </p>
    </div>
  `;
  }

  _generateMarkupVideo(index) {
    return `
    <video class="abilities__content-body-video-s" muted>
      <source src="${videosMp4[index]}" type="video/mp4" />
      <source src="${videosWebm[index]}" type="video/webm" />
      Your browser does not support video!
    </video>
  `;
  }

  handleSkill(skill, skillsDetail) {
    // Handle outline / border
    this._skills.forEach(skill => {
      skill.classList.remove('active');
    });

    skill.classList.add('active');

    // Handle progress
    const skillIndex = +skill.dataset.skillNumber;

    this._skillCircle.style.left = `${4.1 + skillIndex * 9.6}rem`;
    this._skillCircle.classList.add('active');
    setTimeout(() => this._skillCircle.classList.remove('active'), 1000);

    // Handle description
    this._skillDesc.classList.remove('active');
    this._skillDesc.innerHTML = '';
    this._skillDesc.insertAdjacentHTML(
      'afterbegin',
      this._generateMarkupDesc(skillIndex, skillsDetail)
    );
    setTimeout(() => this._skillDesc.classList.add('active'), 300);

    // Handle video
    const video = $('.abilities__content-body-video-s');
    this._videoContainer.removeChild(video);
    this._videoContainer.insertAdjacentHTML(
      'beforeend',
      this._generateMarkupVideo(skillIndex)
    );

    const videoAdded = $('.abilities__content-body-video-s');
    videoAdded.play();
  }

  addHandlerSkill(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const skill = event.target.closest('.ab__skills-skill');

      if (skill) {
        handler(skill);
      }
    });
  }
}

export default new AbilitiesView();
