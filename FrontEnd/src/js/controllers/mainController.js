import axios from 'axios';

import { BACKEND_URL } from '../config';

const fetchVideoButton = document.querySelector('.trailer__play-video-play');
const fetchVideoLoading = document.querySelector(
  '.trailer__play-video-loading'
);
const fetchVideoSuccess = document.querySelector(
  '.trailer__play-video-success'
);

const fetchVideoMessage = document.querySelector(
  '.trailer__play-video-message'
);

const handleErrorMessage = message =>
  (fetchVideoMessage.querySelector('p').textContent = message);

const fetchVideoAgain = fetchVideoMessage.querySelector('span');

let abortController;
let abortTimeoutId;

const newAbortSignal = timeout => {
  console.log('New abort singal!!!!!!!!!!!!!');
  abortController = new AbortController();
  abortTimeoutId = setTimeout(() => {
    console.log('Timeout');
    abortController.abort('Timeout aborts!');
  }, timeout || 0);

  return abortController.signal;
};

const fetchVideo = async () => {
  try {
    fetchVideoMessage.classList.add('remove');
    fetchVideoButton.classList.add('remove');
    fetchVideoLoading.classList.remove('remove');

    handleErrorMessage('Something went wrong!');

    const { data } = await axios({
      method: 'GET',
      url: `${BACKEND_URL}/api/v1/subweb/video`,
      signal: newAbortSignal(30 * 1000),
    });

    if (data.status === 'success') renderVideo(data.video);
  } catch (error) {
    console.error(error);

    // CancelError --> Timout Error | User Aborts
    if (error.code === 'ERR_CANCELED') {
      console.log('ERR_CANCELED');

      if (error.config.signal.reason === 'Timeout aborts!') {
        console.log('Timeout aborts!');
        handleErrorMessage('Request timout error!');
      }

      if (error.config.signal.reason === 'User aborts!') {
        console.log('User aborts!');
        handleErrorMessage('Interception!');
      }
    }

    // Unknow Error
    fetchVideoLoading.classList.add('remove');
    fetchVideoMessage.classList.remove('remove');
  } finally {
    if (abortTimeoutId) clearTimeout(abortTimeoutId);
  }
};

fetchVideoButton.addEventListener('click', fetchVideo);
fetchVideoAgain.addEventListener('click', fetchVideo);

// Abort fetching

const purchaseSkinsButton = document.querySelector('.trailer__content-button');
const purchaseSkinsButtonActive = purchaseSkinsButton.querySelector(
  '.trailer__content-button-border'
);

purchaseSkinsButtonActive.addEventListener('click', () => {
  console.log('Abort');
  if (abortController) abortController.abort('User aborts!');
});

// Render

const trailerVideo = document.querySelector('.trailer__bg-small-video');
const trailerImage = document.querySelector('.trailer__bg-small-image');

const trailerContent = document.querySelector('.trailer__content');

const renderVideo = ({ linkMp4, linkWebm }) => {
  const links = [linkMp4, linkWebm];

  links.forEach(link => {
    const videoLink = `${BACKEND_URL}${link}`;
    const source = document.createElement('source');

    source.src = videoLink;
    trailerVideo.appendChild(source);
  });

  trailerVideo.addEventListener('canplay', () => {
    trailerImage.classList.add('hide');

    // Animation for logo and button then remove to prevent unwnated actions
    // ??? How about click play pause multiple times at once
    trailerContent.classList.add('fade-out');

    // Animation fadeOut is 0.4s
    const timeoutAnimation = 400;

    setTimeout(() => {
      trailerContent.classList.remove('fade-out');
      trailerContent.classList.add('remove');
    }, timeoutAnimation);

    // ---

    fetchVideoLoading.classList.add('remove');
    fetchVideoSuccess.classList.remove('remove');

    // trailerVideo.play();
  });
};

// User click start stop super fast

// Controls ///////////////

// const [videoPlayButton, videoPauseButton] = document.querySelectorAll(
//   '.trailer__play-video-success-control svg'
// );
const speaker = document.querySelector('.trailer__play-video-success-speakers');
const speakers = speaker.querySelectorAll('svg');

// let isVideoPlaying = true;

const displaySpeaker = () =>
  speakers.forEach(spk => {
    if (!spk.classList.contains('active')) spk.classList.add('remove');
  });

displaySpeaker();
