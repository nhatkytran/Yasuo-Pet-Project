import { BACKEND_URL } from '../config';

const promisifyLoadingVideo = (video, { mp4, webm }) =>
  new Promise((resolve, reject) => {
    const sources = [
      [mp4, 'video/mp4'],
      [webm, 'video/webm'],
    ];

    sources.forEach(([link, type]) => {
      const videoLink = `${BACKEND_URL}${link}`;
      const source = document.createElement('source');

      source.type = type;
      source.src = videoLink;

      video.appendChild(source);
    });

    const loadController = new AbortController();
    const errorController = new AbortController();

    video.addEventListener('canplay', () => resolve(errorController.abort()), {
      once: true,
      signal: loadController.signal,
    });
    video.addEventListener('error', () => reject(loadController.abort()), {
      once: true,
      signal: errorController.signal,
    });
  });

export default promisifyLoadingVideo;
