const button = document.querySelector('.sb-ag-header__close');
const right = document.querySelector('.sb-ag-body__right');
const poster = document.querySelector('.ag-poster');

button.addEventListener('click', () => {
  if (right.classList.contains('remove')) right.classList.remove('remove');
  else right.classList.add('remove');

  if (poster.classList.contains('remove')) poster.classList.remove('remove');
  else poster.classList.add('remove');
});
