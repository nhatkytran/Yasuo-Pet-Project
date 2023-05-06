import { subwebView } from './Views';

const handleFetchTrailerVideo = async () => {
  try {
    console.log('FetchData!');
  } catch (error) {
    console.error('Something went wrong!');
    console.error(error);
  }
};

function init() {
  subwebView.addFetchVideoHandler(handleFetchTrailerVideo);
}

init();
