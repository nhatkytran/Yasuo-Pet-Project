import { ERROR_LOAD_IMAGE } from '../config';

const promisifyLoadingImage = (image, source) =>
  new Promise((resolve, reject) => {
    const loadController = new AbortController();
    const errorController = new AbortController();

    image.addEventListener(
      'load',
      () => {
        errorController.abort();
        resolve(null);
      },
      {
        once: true,
        signal: loadController.signal,
      }
    );

    image.addEventListener(
      'error',
      () => {
        loadController.abort();
        reject(new Error(ERROR_LOAD_IMAGE));
      },
      {
        once: true,
        signal: errorController.signal,
      }
    );

    image.src = source;
  });

export default promisifyLoadingImage;
