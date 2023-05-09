import state, { fetchTrailerVideo } from './model';
import { subwebView } from './Views';

const handleFetchTrailerVideo = async () => {
  try {
    subwebView.renderUI('start');

    await fetchTrailerVideo();

    subwebView.renderUI('end');
    subwebView.renderVideo(state.videoTrailerLinks);
  } catch (error) {
    console.error('Something went wrong!');
    console.error(error);

    subwebView.renderError(error);
  }
};

const handlePlayTrailerVideo = () => subwebView.playVideo();

function init() {
  subwebView.addFetchVideoHandler(handleFetchTrailerVideo);
  subwebView.addPlayVideoHandler(handlePlayTrailerVideo);
}

init();
