const skillContainer = document.querySelector('.ab__skills');
const skills = document.querySelectorAll('.ab__skills-skill');
const skillCircle = document.querySelector('.ab__skills-progress-circle');
const skillDesc = document.querySelector('.ab__skills-desc');
const videoContainer = document.querySelector('.abilities__content-body-video');

const skillsDetail = [
  {
    button: 'PASSIVE',
    name: 'WAY OF THE WANDERER',
    desc: "Yasuo's Critical Strike Chance is increased. Additionally, Yasuo builds toward a shield whenever he is moving. The shield triggers when he takes damage from a champion or monster.",
  },
  {
    button: 'Q',
    name: 'STEEL TEMPEST',
    desc: 'Thrusts forward, damaging all enemies in a line. On hit, grants a stack of Gathering Storm for a few seconds. At 2 stacks, Steel Tempest fires a whirlwind that knocks Airborne. Steel Tempest is treated as a basic attack and scales with all the same things.',
  },
  {
    button: 'W',
    name: 'WIND WALL',
    desc: 'Creates a moving wall that blocks all enemy projectiles for 4 seconds.',
  },
  {
    button: 'E',
    name: 'SWEEPING BLADE',
    desc: "Dashes through target enemy, dealing magic damage. Each cast increases your next dash's base Damage, up to a max amount. Cannot be re-cast on the same enemy for a few seconds. If Steel Tempest is cast while dashing, it will strike as a circle.",
  },
  {
    button: 'R',
    name: 'LAST BREATH',
    desc: "Blinks to an Airborne enemy champion, dealing physical damage and holding all Airborne enemies in the area in the air. Grants maximum Flow but resets all stacks of Gathering Storm. For a moderate time afterwards, Yasuo's critical strikes gain significant Bonus Armor Penetration.",
  },
];

skills.forEach((skill, index) =>
  skill.setAttribute('data-skill-number', index)
);

skillContainer.addEventListener('click', function (event) {
  const skill = event.target.closest('.ab__skills-skill');

  if (!skill) return;

  // Handle outline / border
  skills.forEach(skill => {
    skill.classList.remove('active');
  });

  skill.classList.add('active');

  // Handle progress
  const skillIndex = +skill.dataset.skillNumber;
  skillCircle.style.left = `${4.1 + skillIndex * 9.6}rem`;

  skillCircle.classList.add('active');
  setTimeout(() => skillCircle.classList.remove('active'), 1000);

  // Handle description
  skillDesc.classList.remove('active');

  skillDesc.innerHTML = '';
  skillDesc.insertAdjacentHTML('afterbegin', markupDesc(skillIndex));

  setTimeout(() => skillDesc.classList.add('active'), 300);

  // Handle video
  const video = document.querySelector('.abilities__content-body-video-s');

  videoContainer.removeChild(video);
  videoContainer.insertAdjacentHTML('beforeend', markupVideo(skillIndex));
  const videoAdded = document.querySelector('.abilities__content-body-video-s');
  videoAdded.play();
});

const markupDesc = function (index) {
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
};

const markupVideo = function (index) {
  return `
    <video class="abilities__content-body-video-s" muted>
      <source src="./src/img/Skills/${index}.mp4" type="video/mp4" />
      <source src="./src/img/Skills/${index}.webm" type="video/webm" />
      Your browser does not support video!
    </video>
  `;
};
