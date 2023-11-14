import {
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

import { catchAsync, checkTimeoutError, checkAbortError } from '../utils';

import store from '../models/store';
import subwebService from '../models/features/subweb/subwebService';

import ModalContentController from './modalContentController';

const filename = 'subwebController.js';

class SubwebController extends ModalContentController {
  #SubwebView;
  #previousSpeakerVolume = SPEAKER_VOLUME_MAX_PERCENT; // First time loading video with max volume

  constructor(SubwebView) {
    super();
    this.#SubwebView = SubwebView;
  }

  handleLazyLoadingImage = catchAsync({
    filename,
    onProcess: async () => {
      await this.#SubwebView.lazyLoadImage();
      this.#SubwebView.loadMainImage();
    },
  });

  fetchVideo = catchAsync({
    filename,
    onProcess: async () => {
      this.#SubwebView.renderUI(START);
      await subwebService.getData('/api/v1/subweb/video');

      // SubwebView.renderUI(END); --> When video is ready --> SubwebView.playVideo()
      this.#SubwebView.renderVideo(store.state.subweb);
    },
    onError: error => {
      if (checkTimeoutError(error))
        this.#SubwebView.handleTimeoutErrorMessage();
      if (checkAbortError(error)) this.#SubwebView.handleAbortErrorMessage();

      this.#SubwebView.renderUI(ERROR);
    },
  });

  renderVideoFirstTime = handleOpenModal => {
    this.#SubwebView.renderVideoFirstTime();
    super.open(handleOpenModal, this.#SubwebView.open);
  };

  closeInstruction = handleCloseModal =>
    super.close(handleCloseModal, this.#SubwebView.close);

  fetchVideoAbort = () => subwebService.getDataAbort();

  // Play | Pause | Replay
  handleVideoState = (_, button) => {
    const state = this.#SubwebView.checkVideoStateRequired(button);

    if (state === VIDEO_STATE_PLAY || state === VIDEO_STATE_REPLAY)
      this.#SubwebView.playVideo();
    if (state === VIDEO_STATE_PAUSE) this.#SubwebView.pauseVideo();
  };

  // Video ends, display trailer image and replay button
  handleReplayVideo = () => this.#SubwebView.replayVideoUI();

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
