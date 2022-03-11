// const canvasTrailer = document.querySelector('.trailer__bg-small-canvas');
// const bgSmall = document.querySelector('.trailer__bg-small');

// canvasTrailer.width = bgSmall.offsetWidth - 20;
// canvasTrailer.height = bgSmall.offsetHeight + 20;

// window.addEventListener('resize', function () {
//   canvasTrailer.width = bgSmall.offsetWidth - 20;
//   canvasTrailer.height = bgSmall.offsetHeight + 20;
//   draw();
// });

// const ctxTrailer = canvasTrailer.getContext('2d');

// const draw = function () {
//   ctxTrailer.beginPath();
//   ctxTrailer.moveTo(canvasTrailer.width - 28, 0);
//   ctxTrailer.lineTo(canvasTrailer.width, 28);
//   ctxTrailer.lineWidth = 2;
//   ctxTrailer.strokeStyle = 'rgb(126, 126, 126)';
//   ctxTrailer.closePath();
//   ctxTrailer.stroke();
// };

// draw();

// // Button canvas frame ////////////////////////////////////////////
// const trailerButton = document.querySelector('.trailer__content-button');
// const buttonCanvas = document.querySelector('.button__canvas');

// buttonCanvas.width = trailerButton.offsetWidth - 10;
// buttonCanvas.height = trailerButton.offsetHeight + 6;

// // Start video background //////////////////////////////////////////
// // const video = document.querySelector(".trailer__bg-small-video");
// // video.addEventListener("canplay", function () {
// //   setTimeout(function () {
// //     video.play();
// //   }, 3000);
// // });

// // Start loading website ////////////////////////////////////////////
// const trailerImage = document.querySelector('.trailer__content-img');

// window.addEventListener('load', function () {
//   this.setTimeout(function () {
//     trailerImage.classList.add('out');
//   }, 200);
// });

// // Universe ////////////////////////////////////////////////////////
const more = document.querySelector('.find-more');
const universe = document.querySelector('.universe');
const universeX = document.querySelector('.universe-x');
const list2 = document.querySelector('.list-2');
const list2Items = document.querySelectorAll('.list-2__item');

universe.addEventListener('click', function (event) {
  event.preventDefault();

  universeX.classList.toggle('universe-icon');
  list2.classList.toggle('open');

  for (let list2Item of list2Items) {
    list2Item.classList.toggle('open');
  }
});

more.addEventListener('mouseleave', function () {
  universeX.classList.remove('universe-icon');
  list2.classList.remove('open');

  for (let list2Item of list2Items) {
    list2Item.classList.remove('open');
  }
});

// Universe Mobile
const menuMobileOpenBtn = document.querySelector('.mh-menu');
const menuMobile = document.querySelector('.mh-table');
const universeMobile = document.querySelector('.universe-mobile');
const universeMobileMore = document.querySelector('.universe-mobile__more');
const universeMobileClose = document.querySelector('.mh-table__header-close');
const universeMobileOverlay = document.querySelector('.mh-table__cover');
const iconOfUniverse = document.querySelector('.mh-table__universe-x');

menuMobileOpenBtn.addEventListener('click', function () {
  universeMobileOverlay.classList.remove('hide');
  menuMobile.classList.add('show');
});

universeMobile.addEventListener('click', function (event) {
  event.preventDefault();
  universeMobileMore.classList.toggle('show');
  iconOfUniverse.classList.toggle('universe-x');
});

universeMobileClose.addEventListener('click', function () {
  menuMobile.classList.remove('show');

  universeMobileMore.classList.remove('show');
  iconOfUniverse.classList.remove('universe-x');

  universeMobileOverlay.classList.add('hide');
  menuMobile.classList.remove('show');
});

universeMobileOverlay.addEventListener('click', function (event) {
  if (event.target.closest('.mh-table')) return;
  universeMobileMore.classList.remove('show');
  iconOfUniverse.classList.remove('universe-x');

  universeMobileOverlay.classList.add('hide');
  menuMobile.classList.remove('show');
});

// Navbar explore games
const exploreGamesOpen = document.querySelector('.main-header__games');
const exploreGamesContainer = document.querySelector(
  '.explore-games-container'
);
const exploreGames = document.querySelector('.explore-games');
const exploreGamesHeader = document.querySelector('.explore-games__header');
const exploreGamesPoster = document.querySelectorAll(
  '.explore-games__body-poster'
);
const exploreGamesClose = document.querySelector(
  '.explore-games__header-more-close'
);

exploreGamesOpen.addEventListener('click', function () {
  exploreGamesContainer.classList.add('show');
  exploreGames.classList.add('show');

  setTimeout(function () {
    exploreGames.classList.remove('show');

    exploreGamesHeader.classList.add('show');
  }, 200);

  setTimeout(function () {
    exploreGamesPoster.forEach((poster, index) => {
      setTimeout(function () {
        poster.classList.add('show');
      }, (index + 1) * 100);
    });
  }, 400);
});

const closeExploreGames = function (event) {
  exploreGames.classList.add('close-special');
  exploreGamesHeader.classList.remove('show');
  exploreGamesPoster.forEach(poster => {
    poster.classList.remove('show');
  });
  setTimeout(function () {
    exploreGames.classList.remove('close-special');
    exploreGamesContainer.classList.remove('show');
  }, 200);
};

exploreGamesContainer.addEventListener('click', function (event) {
  if (event.target.closest('.explore-games')) return;
  closeExploreGames(event);
});

exploreGamesClose.addEventListener('click', function (event) {
  closeExploreGames(event);
});
