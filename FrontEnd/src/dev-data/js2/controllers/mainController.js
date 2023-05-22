const bodyLeft = document.querySelector('.sb-ag-body__left');

// bodyLeft.classList.add('remove');

const bars = document.querySelectorAll('.sb-ag-body__left-loading span');

function skeletonLoading() {
  bars.forEach(bar => {
    let width = Math.random() * 100;
    if (width < 20) width = 20;

    bar.style.width = `${width}%`;

    let height = Math.random() * 2;
    if (height < 1) height = 1;

    bar.style.height = `${height}rem`;
  });
}

// let intervalID = setInterval(() => {
//   skeletonLoading();
// }, 1500);

// /////////////
const mainHeader = document.querySelector('.main-header');
const sidebarAllGames = document.querySelector('.sb-ag');

// Observer pattern
// Cache state
// Body view --> Function for open or close modal
// User closes sidebar during fetching --> Stop fetching

const modal = document.querySelector('#modal');
let scrollVertical;

modal.addEventListener('click', () => {
  modal.classList.remove('fade-in');
  document.body.classList.remove('modal-open');

  document.body.style.position = 'unset';
  document.body.style.top = `unset`;

  console.log(scrollVertical);
  window.scrollTo({ top: scrollVertical });
});

const handleOpenAllGames = () => {
  console.log('Open All Games!');

  modal.classList.add('fade-in');
  document.body.classList.add('modal-open');

  scrollVertical = window.scrollY;

  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollVertical}px`;

  //

  sidebarAllGames.classList.remove;

  sidebarAllGames.dispatchEvent(new CustomEvent('openAllGames'));
};

sidebarAllGames.addEventListener('openAllGames', event => {
  console.log(123);
});

const mainHeaderClass = 'main-header';
mainHeader.addEventListener('click', function (event) {
  let currentElement = event.target;

  const checkContains = className =>
    currentElement.classList.contains(className);

  while (currentElement) {
    if (checkContains(mainHeaderClass)) return;
    if (checkContains('main-header__riot')) {
      handleOpenAllGames();
      return;
    }

    currentElement = currentElement.parentNode;
  }
});
