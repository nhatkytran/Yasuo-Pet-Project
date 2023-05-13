import { subwebView } from '../Views';
import subwebController from './subwebController';

const {
  handleFetchTrailerVideo,
  handlePlayTrailerVideo,
  handleFetchTrailerVideoAbort,
  handleTrailerVideoState,
  handleReplayVideoTrailer,
  handleSpeakerPower,
  handleSpeakerProgress,
} = subwebController(subwebView);

function init() {
  subwebView.addFetchVideoHandler(handleFetchTrailerVideo); // Fetch Video, handle error
  subwebView.addPlayVideoHandler(handlePlayTrailerVideo); // Play video the first time
  subwebView.addFetchVideoHandlerAbort(handleFetchTrailerVideoAbort); // User cancel fetching video
  subwebView.addControlVideoStateHandler(handleTrailerVideoState); // Play, Pause, Replay video
  subwebView.addReplayVideoHandler(handleReplayVideoTrailer); // Video ends, display trailer image and replay button
  subwebView.addSpeakerPowerHandler(handleSpeakerPower); // Click speaker icon to turn on | off a volume
  subwebView.addSpeakerProgressHandler(...handleSpeakerProgress()); // Adjust volume: click | drag audio bar
}

init();
