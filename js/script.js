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
// const more = document.querySelector('.find-more');
// const universe = document.querySelector('.universe');
// const universeX = document.querySelector('.universe-x');
// const list2 = document.querySelector('.list-2');
// const list2Items = document.querySelectorAll('.list-2__item');

// universe.addEventListener('click', function (event) {
//   event.preventDefault();

//   universeX.classList.toggle('universe-icon');
//   list2.classList.toggle('open');

//   for (let list2Item of list2Items) {
//     list2Item.classList.toggle('open');
//   }
// });

// more.addEventListener('mouseleave', function () {
//   universeX.classList.remove('universe-icon');
//   list2.classList.remove('open');

//   for (let list2Item of list2Items) {
//     list2Item.classList.remove('open');
//   }
// });
