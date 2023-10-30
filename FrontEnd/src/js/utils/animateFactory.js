import { START, END, INVALID_ACTION_MESSAGE } from '../config';

/**
 * @param {HTMLElement} node animated element
 * @param {Object} classes { start: class animation for opening, end: class animation for closing }
 * @returns {Function} (state = START | END): void
 */
const animateFactory = (node, classes) => state => {
  if (state !== START && state !== END) throw new Error(INVALID_ACTION_MESSAGE);

  const add = state === START ? classes.start : classes.end;
  const remove = state === START ? classes.end : classes.start;

  Object.entries({ add, remove }).forEach(([action, classType]) =>
    node.classList[action](classType)
  );
};

export default animateFactory;
