import {
  START,
  VIDEO_STATE_PLAY,
  VIDEO_STATE_PAUSE,
  VIDEO_STATE_REPLAY,
  SPEAKER_VOLUME_MAX_PERCENT,
  SPEAKER_VOLUME_MIN_PERCENT,
  CLICK_VOLUME,
  DRAG_VOLUME,
} from '../config';
import { checkTimeoutError, checkAbortError } from '../helpers';
import state, { fetchTrailerVideo, fetchTrailerVideoAbort } from '../model';

class SubwebController {
  #subwebView;

  // First time loading video with max volume
  #previousSpeakerVolume = SPEAKER_VOLUME_MAX_PERCENT;

  constructor(subwebView) {
    this.#subwebView = subwebView;
  }

  fetchVideo = async () => {
    try {
      this.#subwebView.renderUI(START);

      await fetchTrailerVideo();

      // subwebView.renderUI(END); --> When video is ready --> subwebView.playVideo()
      this.#subwebView.renderVideo(state.videoTrailerLinks);
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      if (checkTimeoutError(error))
        this.#subwebView.handleTimeoutErrorMessage();
      if (checkAbortError(error)) this.#subwebView.handleAbortErrorMessage();

      this.#subwebView.renderError(error);
    }
  };

  fetchVideoAbort = () => fetchTrailerVideoAbort();

  playVideoFirstTime = () => this.#subwebView.playVideoFirstTime();

  // Play | Pause | Replay
  handleVideoState = button => {
    const state = this.#subwebView.checkVideoStateRequired(button);

    if (state === VIDEO_STATE_PLAY || state === VIDEO_STATE_REPLAY)
      this.#subwebView.playVideo();
    if (state === VIDEO_STATE_PAUSE) this.#subwebView.pauseVideo();
  };

  // Video ends, display trailer image and replay button
  replayVideo = () => this.#subwebView.replayVideoUI();

  #adjustSpeakerVolumeAndProgress = volume => {
    this.#subwebView.renderSpeakerAndProgress(volume);
    this.#subwebView.adjustSpeakerVolume(volume);
  };

  // Turn speaker on | off
  handleSpeakerPower = () => {
    const currentSpeakerVolume = this.#subwebView.checkSpeakerVolume();
    const isMuted = currentSpeakerVolume === SPEAKER_VOLUME_MIN_PERCENT;

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

      const currentVolume = this.#subwebView.calculateNewSpeakerVolume(
        event,
        CLICK_VOLUME
      );

      this.#adjustSpeakerVolumeAndProgress(currentVolume);
      this.#previousSpeakerVolume = currentVolume;
    };

    const mousemove = event => {
      if (!isReadyToDrag) return;

      const currentVolume = this.#subwebView.calculateNewSpeakerVolume(
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
