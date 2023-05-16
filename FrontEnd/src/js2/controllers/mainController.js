// import axios from 'axios';

// import { BACKEND_URL } from '../config';

// const fetchVideoButton = document.querySelector('.trailer__play-video-play');
// const fetchVideoLoading = document.querySelector(
//   '.trailer__play-video-loading'
// );
// const fetchVideoSuccess = document.querySelector(
//   '.trailer__play-video-success'
// );

// const fetchVideoMessage = document.querySelector(
//   '.trailer__play-video-message'
// );

// const handleErrorMessage = message =>
//   (fetchVideoMessage.querySelector('p').textContent = message);

// let abortController;
// let abortTimeoutId;

// const newAbortSignal = timeout => {
//   abortController = new AbortController();
//   abortTimeoutId = setTimeout(() => {
//     abortController.abort('Timeout aborts!');
//   }, timeout || 0);

//   return abortController.signal;
// };

// // Abort fetching

// const purchaseSkinsButton = document.querySelector('.trailer__content-button');
// const purchaseSkinsButtonActive = purchaseSkinsButton.querySelector(
//   '.trailer__content-button-border'
// );

// purchaseSkinsButtonActive.addEventListener('click', () => {
//   console.log('Abort');
//   if (abortController) abortController.abort('User aborts!');
// });

// // Fetch video

// const fetchVideo = async () => {
//   try {
//     fetchVideoMessage.classList.add('remove');
//     fetchVideoButton.classList.add('remove');
//     fetchVideoLoading.classList.remove('remove');

//     handleErrorMessage('Something went wrong!');

//     const { data } = await axios({
//       method: 'GET',
//       url: `${BACKEND_URL}/api/v1/subweb/video`,
//       signal: newAbortSignal(30 * 1000),
//     });

//     renderVideo(data.video);
//     controlVideo();

//     fetchVideoLoading.classList.add('remove');
//     fetchVideoSuccess.classList.remove('remove');
//   } catch (error) {
//     // CancelError --> Timout Error | User Aborts
//     if (error.code === 'ERR_CANCELED') {
//       if (error.config.signal.reason === 'Timeout aborts!')
//         handleErrorMessage('Request timout error!');
//       if (error.config.signal.reason === 'User aborts!')
//         handleErrorMessage('Interception!');
//     }

//     fetchVideoLoading.classList.add('remove');
//     fetchVideoMessage.classList.remove('remove');
//   } finally {
//     if (abortTimeoutId) clearTimeout(abortTimeoutId);
//   }
// };

// fetchVideoButton.addEventListener('click', fetchVideo);
// fetchVideoMessage.querySelector('span').addEventListener('click', fetchVideo);

// //

// const trailerVideo = document.querySelector('.trailer__bg-small-video');
// const trailerImage = document.querySelector('.trailer__bg-small-image');
// const trailerContent = document.querySelector('.trailer__content');

// // Render video

// let trailerContentTimeoutId;
// const trailerContentTimeoutAmount = 240;

// const fadeTrailerContent = (currentState, expectedState) => {
//   // in | out
//   trailerContent.classList.remove(`fade-${currentState}`);
//   trailerContent.classList.add(`fade-${expectedState}`);
// };

// const renderVideo = ({ linkMp4, linkWebm }) => {
//   const links = [linkMp4, linkWebm];

//   links.forEach(link => {
//     const videoLink = `${BACKEND_URL}${link}`;
//     const source = document.createElement('source');

//     source.src = videoLink;
//     trailerVideo.appendChild(source);
//   });

//   trailerVideo.addEventListener('canplay', () => {
//     trailerImage.classList.add('hide');

//     fadeTrailerContent('in', 'out');

//     trailerContentTimeoutId = setTimeout(() => {
//       console.log('Timeout');
//       trailerContent.classList.add('remove');
//     }, trailerContentTimeoutAmount);
//   });
// };

// // Control video

// const videoControlButtons = document.querySelectorAll(
//   '.trailer__play-video-success-control svg'
// );

// const displayControl = expectedState =>
//   videoControlButtons.forEach(controlButton => {
//     const action =
//       controlButton.dataset.videoControlState === expectedState
//         ? 'remove'
//         : 'add';

//     controlButton.classList[action]('remove');
//   });

// displayControl('pause');

// const handlePlayVideo = () => {
//   console.log('Play');

//   displayControl('pause');
//   trailerVideo.play();

//   fadeTrailerContent('in', 'out');
//   trailerContentTimeoutId = setTimeout(() => {
//     trailerContent.classList.add('remove');
//   }, trailerContentTimeoutAmount);
// };

// const handlePauseVideo = () => {
//   console.log('Pause');

//   displayControl('play');
//   trailerVideo.pause();

//   if (trailerContentTimeoutId) clearTimeout(trailerContentTimeoutId);
//   trailerContent.classList.remove('remove');
//   fadeTrailerContent('out', 'in');
// };

// videoControlButtons.forEach(videoControlButton =>
//   videoControlButton.addEventListener('click', function () {
//     const state = this.dataset.videoControlState;

//     if (state === 'play' || state === 'replay') handlePlayVideo();
//     if (state === 'pause') handlePauseVideo();
//   })
// );

// const controlVideo = () => {
//   trailerVideo.play();
// };

// // Video finishes running

// trailerVideo.addEventListener('ended', () => {
//   displayControl('replay');

//   trailerImage.classList.remove('hide');

//   if (trailerContentTimeoutId) clearTimeout(trailerContentTimeoutId);
//   trailerContent.classList.remove('remove');
//   fadeTrailerContent('out', 'in');
// });

// // Speaker

// const speaker = document.querySelector('.trailer__play-video-success-speakers');
// const speakers = speaker.querySelectorAll('svg');

// const displaySpeaker = percent => {
//   // Speaker'state --> Muted | Slow | Medium | High
//   const speakerIndex = Math.ceil((percent / 100) * 3);

//   speakers.forEach((spk, i) =>
//     speakerIndex !== i
//       ? spk.classList.add('remove')
//       : spk.classList.remove('remove')
//   );
// };

// displaySpeaker(100);

// const audioProgress = document.querySelector(
//   '.trailer__play-video-success-bar'
// );
// const audioProgressBar = document.querySelector(
//   '.trailer__play-video-success-bar-active'
// );

// const adjustVideoVolume = percent => (trailerVideo.volume = percent / 100);

// let isMuted = false;
// let currentPercent = 100;

// speaker.addEventListener('click', () => {
//   if (!isMuted) {
//     audioProgressBar.style.width = `${0}%`;
//     displaySpeaker(0);
//     adjustVideoVolume(0);
//   } else {
//     audioProgressBar.style.width = `${currentPercent}%`;
//     displaySpeaker(currentPercent);
//     adjustVideoVolume(currentPercent);
//   }

//   console.log(isMuted);

//   isMuted = !isMuted;
// });

// let isAudioReadyToDrag = false;

// audioProgress.addEventListener('mousedown', event => {
//   isAudioReadyToDrag = true;

//   const clientX = event.clientX;
//   const { left: audioProgressLeft, width: audioProgressWidth } =
//     audioProgress.getBoundingClientRect();

//   const percent = ((clientX - audioProgressLeft) / audioProgressWidth) * 100;

//   currentPercent = percent;
//   audioProgressBar.style.width = `${percent}%`;
//   displaySpeaker(percent);
//   adjustVideoVolume(percent);
// });

// document.addEventListener('mousemove', event => {
//   if (!isAudioReadyToDrag) return;

//   const {
//     left: audioProgressLeft,
//     right: audioProgressRight,
//     width: audioProgressWidth,
//   } = audioProgress.getBoundingClientRect();

//   let clientX = event.clientX;

//   if (clientX < audioProgressLeft) clientX = audioProgressLeft;
//   else if (clientX > audioProgressRight) clientX = audioProgressRight;

//   const percent = ((clientX - audioProgressLeft) / audioProgressWidth) * 100;

//   currentPercent = percent;
//   audioProgressBar.style.width = `${percent}%`;
//   displaySpeaker(percent);
//   adjustVideoVolume(percent);
// });

// document.addEventListener('mouseup', () => {
//   if (isAudioReadyToDrag) isAudioReadyToDrag = false;
// });

// Sidebar all games ////////////////////////////////

const bodyLeft = document.querySelector('.sb-ag-body__left');

bodyLeft.classList.add('remove');

const bars = document.querySelectorAll('.sb-ag-body__left-loading span');

let intervalID = setInterval(() => {
  bars.forEach(bar => {
    let width = Math.random() * 100;
    if (width < 20) width = 20;

    bar.style.width = `${width}%`;

    let height = Math.random() * 2;
    if (height < 1) height = 1;

    bar.style.height = `${height}rem`;
  });
}, 1500);
