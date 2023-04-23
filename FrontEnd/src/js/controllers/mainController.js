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
const fetchVideoAgain = fetchVideoMessage.querySelector('span');

const fetchVideo = async () => {
  try {
    fetchVideoMessage.classList.add('remove');
    fetchVideoButton.classList.add('remove');
    fetchVideoLoading.classList.remove('remove');

    const { data } = await axios({
      method: 'GET',
      url: `${BACKEND_URL}/api/v1/subweb/video`,
    });

    if (data.status === 'success') renderVideo(data.video);
  } catch (error) {
    console.error(error);
    fetchVideoLoading.classList.add('remove');
    fetchVideoMessage.classList.remove('remove');
  }
};

fetchVideoButton.addEventListener('click', fetchVideo);
fetchVideoAgain.addEventListener('click', fetchVideo);

const trailerVideo = document.querySelector('.trailer__bg-small-video');

const trailerImage = document.querySelector('.trailer__bg-small-image');

const trailerLogo = document.querySelector('.trailer__content-img');
const purchaseSkinsButton = document.querySelector('.trailer__content-button');
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

// ??? When fetching video, if user clicks "purchase skins" --> stop fetching
