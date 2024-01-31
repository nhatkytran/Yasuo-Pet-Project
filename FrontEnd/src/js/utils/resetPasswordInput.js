import { $$_ } from './selectors';
import { ADD, REMOVE } from '../config';
import classRemove from './classRemove';

const resetPasswordInput = (input, typeButton) => {
  input.setAttribute('type', 'password');
  $$_(typeButton, 'svg').forEach((svg, index) =>
    classRemove(index === 0 ? REMOVE : ADD, svg)
  );
};

export default resetPasswordInput;
