import { ADD, REMOVE } from './config';

export const $ = document.querySelector.bind(document);
export const $$ = document.querySelectorAll.bind(document);

export const $_ = (node, selector) => node.querySelector(selector);
export const $$_ = (node, selector) => node.querySelectorAll(selector);

export const classRemove = (state, ...els) => {
  if (state === ADD) els.forEach(el => el.classList.add('remove'));
  if (state === REMOVE) els.forEach(el => el.classList.remove('remove'));
};

export const promisifyLoadingImage = (image, source) =>
  new Promise((resolve, reject) => {
    const loadController = new AbortController();
    const errorController = new AbortController();

    // rrorController.abort()
    // resolve()
    // resolve(errorController.abort()) --> Only for write less code purpose, don't use data in resolve

    image.addEventListener('load', () => resolve(errorController.abort()), {
      once: true,
      signal: loadController.signal,
    });
    image.addEventListener('error', () => reject(loadController.abort()), {
      once: true,
      signal: errorController.signal,
    });

    image.src = source;
  });

export const mapMarkup = (items, callback) => items.map(callback).join('');
