import { modalView, subwebView, exploreAllgamesView } from '../Views';
import ModalController from './modalController';
import subwebController from './subwebController';
import ExploreAllgamesController from './exploreAllgamesController';

const modalController = new ModalController(modalView);

function modalInit() {
  modalView.addCloseModalHandler(modalController.close);
}

function subwebInit() {
  const controller = new subwebController(subwebView);

  subwebView.addFetchVideoHandler(controller.fetchVideo);
  subwebView.addFetchVideoHandlerAbort(controller.fetchVideoAbort);
  subwebView.addPlayVideoHandler(controller.playVideoFirstTime);
  subwebView.addControlVideoStateHandler(controller.handleVideoState);
  subwebView.addReplayVideoHandler(controller.replayVideo);
  subwebView.addSpeakerPowerHandler(controller.handleSpeakerPower);
  subwebView.addSpeakerProgressHandler(...controller.handleSpeakerProgress());
}

function exploreAllgamesInit() {
  const controller = new ExploreAllgamesController(exploreAllgamesView);

  exploreAllgamesView.addOpenSidebarHandler(
    controller.open.bind(controller, modalController.open)
  );
  exploreAllgamesView.addCloseSidebarHandler(
    controller.close.bind(controller, modalController.close)
  );
  exploreAllgamesView.addFetchAndDisplayDataHandler(controller.handleData);
  exploreAllgamesView.addHoverSelectPostersHandler(controller.selectPosters);
  exploreAllgamesView.addOpenLinksHandler(controller.openLinks);
}

modalInit();
subwebInit();
exploreAllgamesInit();
