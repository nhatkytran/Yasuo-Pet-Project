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

// Abort fetching

const purchaseSkinsButton = document.querySelector('.trailer__content-button');
const purchaseSkinsButtonActive = purchaseSkinsButton.querySelector(
  '.trailer__content-button-border'
);

purchaseSkinsButtonActive.addEventListener('click', () => {
  console.log('Abort');
  if (abortController) abortController.abort('User aborts!');
});

// Fetch video

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

    if (data.status === 'success') {
      renderVideo(data.video);
      controlVideo();
    }
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

//

const trailerVideo = document.querySelector('.trailer__bg-small-video');
const trailerImage = document.querySelector('.trailer__bg-small-image');

const trailerContent = document.querySelector('.trailer__content');

// Control video

const videoControlButtons = document.querySelectorAll(
  '.trailer__play-video-success-control svg'
);

const displayControl = expectedState =>
  videoControlButtons.forEach(controlButton => {
    const state = controlButton.dataset.videoControlState;

    if (state === expectedState) controlButton.classList.remove('remove');
    else controlButton.classList.add('remove');
  });

displayControl('pause');

const playVideo = () => {
  console.log('Play');
  trailerVideo.play();
};
const pauseVideo = () => {
  console.log('Pause');
  trailerVideo.pause();
};
const replayVideo = () => {
  console.log('Replay');
};

videoControlButtons.forEach(videoControlButton =>
  videoControlButton.addEventListener('click', function () {
    const state = this.dataset.videoControlState;

    if (state === 'play') {
      displayControl('pause');
      playVideo();
    }
    if (state === 'pause') {
      displayControl('play');
      pauseVideo();
    }
    if (state === 'replay') replayVideo();
  })
);

const controlVideo = () => {
  trailerVideo.play();
};

// Render video

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
  });
};

// User click start stop super fast

// Controls ///////////////

// const [videoPlayButton, videoPauseButton] = document.querySelectorAll(
//   '.trailer__play-video-success-control svg'
// );
const speaker = document.querySelector('.trailer__play-video-success-speakers');
const speakers = speaker.querySelectorAll('svg');

const displaySpeaker = index =>
  speakers.forEach((spk, i) =>
    index !== i ? spk.classList.add('remove') : spk.classList.remove('remove')
  );

displaySpeaker(3);

const audioProgress = document.querySelector(
  '.trailer__play-video-success-bar'
);
const audioProgressBar = document.querySelector(
  '.trailer__play-video-success-bar-active'
);

let isAudioReadyToDrag = false;

audioProgress.addEventListener('mousedown', event => {
  isAudioReadyToDrag = true;

  const clientX = event.clientX;
  const { left: audioProgressLeft, width: audioProgressWidth } =
    audioProgress.getBoundingClientRect();
  const percent = ((clientX - audioProgressLeft) / audioProgressWidth) * 100;

  audioProgressBar.style.width = `${percent}%`;

  const speakerIndex = Math.ceil((percent / 100) * 3);
  displaySpeaker(speakerIndex);
});

document.addEventListener('mousemove', event => {
  if (isAudioReadyToDrag) {
    const {
      left: audioProgressLeft,
      right: audioProgressRight,
      width: audioProgressWidth,
    } = audioProgress.getBoundingClientRect();

    let clientX = event.clientX;

    if (clientX < audioProgressLeft) clientX = audioProgressLeft;
    else if (clientX > audioProgressRight) clientX = audioProgressRight;

    const percent = ((clientX - audioProgressLeft) / audioProgressWidth) * 100;

    audioProgressBar.style.width = `${percent}%`;

    const speakerIndex = Math.ceil((percent / 100) * 3);
    displaySpeaker(speakerIndex);
  }
});

document.addEventListener('mouseup', () => {
  if (isAudioReadyToDrag) isAudioReadyToDrag = false;
});

// Click on Speaker --> Mute
// Draw flow chart
