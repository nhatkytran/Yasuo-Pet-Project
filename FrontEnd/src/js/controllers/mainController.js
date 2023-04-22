import axios from 'axios';

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
      url: 'http://127.0.0.1:3000/api/v1/subweb/video',
    });

    fetchVideoLoading.classList.add('remove');
    fetchVideoSuccess.classList.remove('remove');

    console.log(data);
  } catch (error) {
    console.error(error);
    fetchVideoLoading.classList.add('remove');
    fetchVideoMessage.classList.remove('remove');
  }
};

fetchVideoButton.addEventListener('click', fetchVideo);
fetchVideoAgain.addEventListener('click', fetchVideo);
