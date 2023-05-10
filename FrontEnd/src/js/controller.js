import state, { fetchTrailerVideo, fetchTrailerVideoAbort } from './model';
import { subwebView } from './Views';

const handleFetchTrailerVideo = async () => {
  try {
    subwebView.renderUI('start');

    await fetchTrailerVideo();

    // subwebView.renderUI('end'); --> When video is ready --> subwebView.playVideo()
    subwebView.renderVideo(state.videoTrailerLinks);
  } catch (error) {
    console.error('Something went wrong!');
    console.error(error);

    subwebView.renderError(error);
  }
};

const handlePlayTrailerVideo = () => subwebView.playVideo();
const handleFetchTrailerVideoAbort = () => fetchTrailerVideoAbort();

function init() {
  subwebView.addFetchVideoHandler(handleFetchTrailerVideo);
  subwebView.addPlayVideoHandler(handlePlayTrailerVideo);
  subwebView.addFetchVideoHandlerAbort(handleFetchTrailerVideoAbort);
}

init();
