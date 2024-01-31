import { $$_ } from './selectors';

const passwordTypeDisplayFactory = (input, typeButton) => () =>
  $$_(typeButton, 'svg').forEach((svg, index) => {
    svg.classList.toggle('remove');
    if (!svg.classList.contains('remove'))
      input.setAttribute('type', index === 0 ? 'password' : 'text');
  });

export default passwordTypeDisplayFactory;
