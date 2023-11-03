import {
  BACKEND_URL,
  START,
  ERROR,
  VIDEO_STATE_PLAY,
  VIDEO_STATE_PAUSE,
  VIDEO_STATE_REPLAY,
  SPEAKER_VOLUME_MAX_PERCENT,
  SPEAKER_VOLUME_MIN_PERCENT,
  CLICK_VOLUME,
  DRAG_VOLUME,
} from '../config';

import {
  catchAsync,
  checkTimeoutError,
  checkAbortError,
  sendErrorToAdmin,
} from '../utils';
import state, { fetchTrailerVideo, fetchTrailerVideoAbort } from '../model';

class SubwebController {
  #SubwebView;
  #previousSpeakerVolume = SPEAKER_VOLUME_MAX_PERCENT; // First time loading video with max volume

  constructor(SubwebView) {
    this.#SubwebView = SubwebView;
  }

  handleLazyLoadingImage = async () => {
    try {
      await this.#SubwebView.lazyLoadImage();
      this.#SubwebView.loadMainImage();
    } catch (error) {
      sendErrorToAdmin(error, 'subwebController.js');
    }
  };

  fetchVideo = catchAsync({
    onProcess: async () => {
      this.#SubwebView.renderUI(START);
      await fetchTrailerVideo();

      // SubwebView.renderUI(END); --> When video is ready --> SubwebView.playVideo()
      this.#SubwebView.renderVideo(state.videoTrailerLinks);
    },
    onError: error => {
      if (checkTimeoutError(error))
        this.#SubwebView.handleTimeoutErrorMessage();
      if (checkAbortError(error)) this.#SubwebView.handleAbortErrorMessage();

      this.#SubwebView.renderUI(ERROR);
    },
  });

  playVideoFirstTime = () => this.#SubwebView.playVideoFirstTime();
  fetchVideoAbort = () => fetchTrailerVideoAbort();

  // Play | Pause | Replay
  handleVideoState = (_, button) => {
    const state = this.#SubwebView.checkVideoStateRequired(button);

    if (state === VIDEO_STATE_PLAY || state === VIDEO_STATE_REPLAY)
      this.#SubwebView.playVideo();
    if (state === VIDEO_STATE_PAUSE) this.#SubwebView.pauseVideo();
  };

  // Video ends, display trailer image and replay button
  replayVideo = () => this.#SubwebView.replayVideoUI();

  #adjustSpeakerVolumeAndProgress = volume => {
    this.#SubwebView.renderSpeakerAndProgress(volume);
    this.#SubwebView.adjustSpeakerVolume(volume);
  };

  // Turn speaker on | off
  handleSpeakerPower = () => {
    const currentVolume = this.#SubwebView.checkSpeakerVolume();
    const isMuted = currentVolume === SPEAKER_VOLUME_MIN_PERCENT;

    // if previousSpeakerVolume is 0, know that it is muted and need to get back to 100
    if (this.#previousSpeakerVolume === SPEAKER_VOLUME_MIN_PERCENT)
      this.#previousSpeakerVolume = SPEAKER_VOLUME_MAX_PERCENT;

    this.#adjustSpeakerVolumeAndProgress(
      isMuted ? this.#previousSpeakerVolume : 0
    );
  };

  // Adjust volume: click | drag audio bar
  handleSpeakerProgress = () => {
    let isReadyToDrag = false;

    const mousedown = event => {
      isReadyToDrag = true;

      const currentVolume = this.#SubwebView.calculateNewSpeakerVolume(
        event,
        CLICK_VOLUME
      );

      this.#adjustSpeakerVolumeAndProgress(currentVolume);
      this.#previousSpeakerVolume = currentVolume;
    };

    const mousemove = event => {
      if (!isReadyToDrag) return;

      const currentVolume = this.#SubwebView.calculateNewSpeakerVolume(
        event,
        DRAG_VOLUME
      );

      this.#adjustSpeakerVolumeAndProgress(currentVolume);
      this.#previousSpeakerVolume = currentVolume;
    };

    const mouseup = () => {
      if (isReadyToDrag) isReadyToDrag = false;
    };

    return [mousedown, mousemove, mouseup];
  };
}

export default SubwebController;
