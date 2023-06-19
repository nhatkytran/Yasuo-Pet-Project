import { ADD, REMOVE } from '../config';

const classRemove = (state, ...els) => {
  if (state === ADD) els.forEach(el => el.classList.add('remove'));
  if (state === REMOVE) els.forEach(el => el.classList.remove('remove'));
};

export default classRemove;
