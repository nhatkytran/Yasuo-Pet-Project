import {
  FETCH_START,
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

function subwebController(subwebView) {
  const handleFetchTrailerVideo = async () => {
    try {
      // subwebView.#resetErrorMessage();
      subwebView.renderUI(FETCH_START);

      await fetchTrailerVideo();

      // subwebView.renderUI(FETCH_END); --> When video is ready --> subwebView.playVideo()
      subwebView.renderVideo(state.videoTrailerLinks);
    } catch (error) {
      // test
      console.error('Something went wrong!');
      console.error(error);

      if (checkTimeoutError(error)) subwebView.handleTimeoutErrorMessage();
      if (checkAbortError(error)) subwebView.handleAbortErrorMessage();

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

  const adjustSpeakerVolumeAndProgress = currentSpeakerVolume => {
    subwebView.renderSpeakerAndProgress(currentSpeakerVolume);
    subwebView.adjustSpeakerVolume(currentSpeakerVolume);
  };

  const speakerPower = () => {
    let previousSpeakerVolume = SPEAKER_VOLUME_MAX_PERCENT; // First time loading video with max volume

    const setPreviousSpeakerVolume = newVolume =>
      (previousSpeakerVolume = newVolume);

    const handleSpeakerPower = () => {
      const currentSpeakerVolume = subwebView.checkSpeakerVolume();
      const isMuted = currentSpeakerVolume === SPEAKER_VOLUME_MIN_PERCENT;

      let expectedSpeakerVolume;

      // if previousSpeakerVolume is 0, know that it is muted and need to get back to 100
      if (previousSpeakerVolume === SPEAKER_VOLUME_MIN_PERCENT)
        previousSpeakerVolume = setPreviousSpeakerVolume(
          SPEAKER_VOLUME_MAX_PERCENT
        );

      expectedSpeakerVolume = isMuted ? previousSpeakerVolume : 0;

      adjustSpeakerVolumeAndProgress(expectedSpeakerVolume);
    };

    return { handleSpeakerPower, setPreviousSpeakerVolume };
  };

  const { handleSpeakerPower, setPreviousSpeakerVolume } = speakerPower();

  const handleSpeakerProgress = () => {
    let isReadyToDrag = false;

    const mousedown = event => {
      isReadyToDrag = true;

      const currentSpeakerVolume = subwebView.calculateNewSpeakerVolume(
        event,
        CLICK_VOLUME
      );

      setPreviousSpeakerVolume(currentSpeakerVolume);
      adjustSpeakerVolumeAndProgress(currentSpeakerVolume);
    };

    const mousemove = event => {
      if (!isReadyToDrag) return;

      const currentSpeakerVolume = subwebView.calculateNewSpeakerVolume(
        event,
        DRAG_VOLUME
      );

      setPreviousSpeakerVolume(currentSpeakerVolume);
      adjustSpeakerVolumeAndProgress(currentSpeakerVolume);
    };

    const mouseup = () => {
      if (isReadyToDrag) isReadyToDrag = false;
    };

    return [mousedown, mousemove, mouseup];
  };

  return {
    handleFetchTrailerVideo,
    handlePlayTrailerVideo,
    handleFetchTrailerVideoAbort,
    handleTrailerVideoState,
    handleReplayVideoTrailer,
    handleSpeakerPower,
    handleSpeakerProgress,
  };
}

export default subwebController;
