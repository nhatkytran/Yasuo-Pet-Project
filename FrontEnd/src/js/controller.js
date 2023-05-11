import {
  FETCH_START,
  VIDEO_STATE_PLAY,
  VIDEO_STATE_PAUSE,
  VIDEO_STATE_REPLAY,
} from './config';
import state, { fetchTrailerVideo, fetchTrailerVideoAbort } from './model';
import { subwebView } from './Views';

const handleFetchTrailerVideo = async () => {
  try {
    // subwebView.#resetErrorMessage();
    subwebView.renderUI(FETCH_START);

    await fetchTrailerVideo();

    // subwebView.renderUI(FETCH_END); --> When video is ready --> subwebView.playVideo()
    subwebView.renderVideo(state.videoTrailerLinks);
  } catch (error) {
    console.error('Something went wrong!');
    console.error(error);

    if (error.code === 'ECONNABORTED' && error.message.includes('timeout'))
      subwebView.handleTimeoutErrorMessage();
    if (error.code === 'ERR_CANCELED' && error.message.includes('canceled'))
      subwebView.handleAbortErrorMessage();

    subwebView.renderError(error);
  }
};

const handlePlayTrailerVideo = () => subwebView.playVideoFirstTime();

const handleFetchTrailerVideoAbort = () => fetchTrailerVideoAbort();

const handleTrailerVideoState = button => {
  const state = subwebView.checkVideoStateRequired(button);

  if (state === VIDEO_STATE_PLAY || state === VIDEO_STATE_REPLAY)
    subwebView.playVideo();
  if (state === VIDEO_STATE_PAUSE) subwebView.pauseVideo();
};

const handleReplayVideoTrailer = () => subwebView.replayVideoUI();

function init() {
  subwebView.addFetchVideoHandler(handleFetchTrailerVideo); // Fetch Video, handle error
  subwebView.addPlayVideoHandler(handlePlayTrailerVideo); // Play video the first time
  subwebView.addFetchVideoHandlerAbort(handleFetchTrailerVideoAbort); // User cancel fetching video
  subwebView.addControlVideoStateHandler(handleTrailerVideoState); // Play, Pause, Replay video
  subwebView.addReplayVideoHandler(handleReplayVideoTrailer); // Video ends, display trailer image and replay button
}

init();
