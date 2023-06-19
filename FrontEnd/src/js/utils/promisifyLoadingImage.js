// rrorController.abort()
// resolve()
// resolve(errorController.abort()) --> Only for write less code purpose, don't use data in resolve
const promisifyLoadingImage = (image, source) =>
  new Promise((resolve, reject) => {
    const loadController = new AbortController();
    const errorController = new AbortController();

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

export default promisifyLoadingImage;
