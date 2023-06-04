import { ANIMATION_TIMEOUT } from '../config';
import { modalView, exploreAllgamesView } from '../Views';

const handleModal = () => {
  let modalIsOpening;
  let modalIsClosing;
  let scrollVertical;

  const handleOpenModal = () => {
    modalIsOpening = true;
    scrollVertical = modalView.open();

    setTimeout(() => {
      modalIsOpening = false;
    }, ANIMATION_TIMEOUT);
  };

  const handleCloseModal = () => {
    if (modalIsOpening || modalIsClosing) return;

    modalIsClosing = true;

    // Delay with timeout to wait for sidebar's closing
    setTimeout(() => {
      modalIsClosing = false;
      modalView.close(scrollVertical);
    }, ANIMATION_TIMEOUT);
  };

  return { handleOpenModal, handleCloseModal };
};

const { handleOpenModal, handleCloseModal } = handleModal();

const handleExploreAllgamesSidebar = () => {
  const handleOpenExploreAllgamesSidebar = () => {
    handleOpenModal();

    setTimeout(() => {
      exploreAllgamesView.openSidebarSignal();
    }, ANIMATION_TIMEOUT);
  };

  return { handleOpenExploreAllgamesSidebar };
};

const { handleOpenExploreAllgamesSidebar } = handleExploreAllgamesSidebar();

function init() {
  modalView.addCloseModalHandler(handleCloseModal);

  exploreAllgamesView.addOpenSidebarHandler(handleOpenExploreAllgamesSidebar);
}

init();

/////////////////////////////////////////////////

// import { subwebView } from '../Views';
// import subwebController from './subwebController';

// const {
//   handleFetchTrailerVideo,
//   handlePlayTrailerVideo,
//   handleFetchTrailerVideoAbort,
//   handleTrailerVideoState,
//   handleReplayVideoTrailer,
//   handleSpeakerPower,
//   handleSpeakerProgress,
// } = subwebController(subwebView);

// function init() {
//   subwebView.addFetchVideoHandler(handleFetchTrailerVideo); // Fetch Video, handle error
//   subwebView.addPlayVideoHandler(handlePlayTrailerVideo); // Play video the first time
//   subwebView.addFetchVideoHandlerAbort(handleFetchTrailerVideoAbort); // User cancel fetching video
//   subwebView.addControlVideoStateHandler(handleTrailerVideoState); // Play, Pause, Replay video
//   subwebView.addReplayVideoHandler(handleReplayVideoTrailer); // Video ends, display trailer image and replay button
//   subwebView.addSpeakerPowerHandler(handleSpeakerPower); // Click speaker icon to turn on | off a volume
//   subwebView.addSpeakerProgressHandler(...handleSpeakerProgress()); // Adjust volume: click | drag audio bar
// }

// init();
