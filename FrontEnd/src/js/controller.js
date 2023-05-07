import state, { fetchTrailerVideo } from './model';
import { subwebView } from './Views';

const handleFetchTrailerVideo = async () => {
  try {
    subwebView.renderUI('start');

    await fetchTrailerVideo();

    console.log('Data:', state.videoTrailerLinks);
  } catch (error) {
    console.error('Something went wrong!');
    console.error(error);
  }
};

function init() {
  subwebView.addFetchVideoHandler(handleFetchTrailerVideo);
}

init();
