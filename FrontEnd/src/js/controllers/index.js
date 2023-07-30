import {
  modalView,
  subwebView,
  exploreAllgamesView,
  exploreGamesView,
  menuMobileView,
  abilitiesView,
  skinsView,
  skins2View,
  ruinedView,
  galleryView,
} from '../Views';

import ModalController from './modalController';
import subwebController from './subwebController';
import ExploreAllgamesController from './exploreAllgamesController';
import ExploreGamesController from './exploreGamesController';
import MenuMobileController from './menuMobileController';
import AbilitiesController from './abilitesController';
import SkinsController from './skinsController';
import Skins2Controller from './skins2Controller';
import RuinedController from './ruinedController';
import GalleryController from './galleryController';

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
  exploreAllgamesView.addOpenLinksHandler(controller.toggleLinks);
}

function exploreGamesInit() {
  const controller = new ExploreGamesController(exploreGamesView);

  exploreGamesView.addOpenSidebarHandler(
    controller.open.bind(controller, modalController.open)
  );
  exploreGamesView.addCloseSidebarHandler(
    controller.close.bind(controller, modalController.close)
  );
  exploreGamesView.addFetchAndDisplayDataHandler(controller.handleData);
}

function menuMobileInit() {
  const controller = new MenuMobileController(menuMobileView);

  menuMobileView.addOpenMenuHandler(
    controller.open.bind(controller, modalController.open)
  );
  menuMobileView.addCloseMenuHandler(
    controller.close.bind(controller, modalController.close)
  );
  menuMobileView.addToggleUniverseMobile(controller.toggle);
}

function abilitiesInit() {
  const controller = new AbilitiesController(abilitiesView);

  abilitiesView.addChooseSkillHander(controller.chooseSkill);
  abilitiesView.addReFetchHandler(controller.handleData);
}

function skinsInit() {
  const controller = new SkinsController(skinsView);

  skinsView.addIntersectionObserver(controller.handleData);
  skinsView.addSlideHandler(controller.handleSlide);
  skinsView.addBuySkinsQuestionHandler(controller.buySkinsQuestion);
  skinsView.addExploreSkinsHandler(controller.exploreSkins);
}

function skins2Init() {
  const controller = new Skins2Controller(skins2View);

  skins2View.addIntersectionObserver(controller.handleData);

  skins2View.addChooseSlideHandler(controller.slideActions.chooseSlide);
  skins2View.addDragSlideHandler(
    controller.slideActions.dragStart,
    controller.slideActions.dragProgress,
    controller.slideActions.dragStop
  );

  skins2View.addChooseMbSlideHandler(controller.mbSlideActions.chooseMbSlide);
  skins2View.addDragMbSlideHandler(
    controller.mbSlideActions.dragStart,
    controller.mbSlideActions.dragProgress,
    controller.mbSlideActions.dragStop
  );

  skins2View.addMbSliderResizeHandler(controller.mbSlideActions.resize);
}

function ruinedInit() {
  const controller = new RuinedController(ruinedView);

  ruinedView.addIntersectionObserver(controller.handleData);
}

function galleryInit() {
  const controller = new GalleryController(galleryView);

  galleryView.addIntersectionObserver(controller.handleData);
}

// modalInit();
// subwebInit();
// exploreAllgamesInit();
// exploreGamesInit();
// menuMobileInit();
// abilitiesInit();
// skinsInit();
// skins2Init();
// ruinedInit();
galleryInit();
