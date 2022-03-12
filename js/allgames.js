const allGames = document.querySelector('.sb-ag-body__left');
const allGamesItems = document.querySelectorAll('.sb-ag-body__left-link');
const agMainPoster = document.querySelector('.sb-ag-body__right');

allGamesItems.forEach((item, index) => {
  item.setAttribute('data-agi-id', `ag__img--${index + 1}`);
});

let hovered;
const checkHover = function (event) {
  if (event.target.closest('.sb-ag-body__left-link')) {
    hovered = true;
  } else {
    hovered = false;
  }

  if (hovered !== checkHover.hovered) {
    if (hovered) {
      console.log(event.target);

      agMainPoster.classList.add('hide');
      agMainPoster.insertAdjacentHTML('afterbegin', hoverMarkup());
    } else {
      document.querySelector('.sb-ag-body__right--hover').remove();
      agMainPoster.classList.remove('hide');
    }
  }

  checkHover.hovered = hovered;
};
checkHover.hovered = false;

allGames.addEventListener('mousemove', checkHover);

const hoverMarkup = function () {
  return `
    <div class="sb-ag-body__right--hover">
      <div class="sb-ag-body__right--hover-frame"></div>
      <div class="ag__hover-content">
        <div class="ag__hover-content--child">
          <img
            class="ag__hover-imgs"
            src="./src/img/nav-ag/ag__img--1s.png"
            alt="ARCANE"
            title="ARCANE"
          />
          <p class="ag__hover-text">
            Earn in-game rewards and learn more about Riot's games
          </p>
        </div>
      </div>
      <img
        class="ag__hover-img"
        src="./src/img/nav-ag/ag__img--1.jpeg"
        alt="ARCANE"
        title="ARCANE"
      />
    </div>
  `;
};
