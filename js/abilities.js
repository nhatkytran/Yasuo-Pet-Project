// const checkHovered = function (
//   classNameParent,
//   classNameChildren,
//   hoveredCallback,
//   notHoveredCallback
// ) {
//   const parentElement = document.querySelector(classNameParent);

//   let hovered;
//   let stateHovered = false;
//   let hoveredElement;

//   parentElement.addEventListener('mousemove', function (event) {
//     const childrenElement = event.target.closest(classNameChildren);

//     hovered = childrenElement ? true : false;
//     hoveredElement = hovered ? childrenElement : hoveredElement;

//     if (hovered === stateHovered) return;

//     hovered
//       ? hoveredCallback(hoveredElement)
//       : notHoveredCallback(hoveredElement);

//     stateHovered = hovered;
//   });
// };

// checkHovered(
//   '.ab__skills',
//   '.ab__skills-skill',
//   hoveredElement => {
//     hoveredElement.classList.add('hovered');
//   },
//   hoveredElement => {
//     hoveredElement.classList.remove('hovered');
//   }
// );

const skills = document.querySelector('.ab__skills');

skills.addEventListener('click', function (event) {
  const skill = event.target.closest('.ab__skills-skill');

  if (!skill) return;

  console.log(skill);
});
