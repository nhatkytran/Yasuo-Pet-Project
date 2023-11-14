// import {
//   modalView,
//   subwebView,
//   exploreAllgamesView,
//   exploreGamesView,
//   menuMobileView,
//   abilitiesView,
//   skinsView,
//   skins2View,
//   ruinedView,
//   galleryView,
//   warningView,
// } from '../Views';

// import WarningController from './warningController';
// import subwebController from './subwebController';
// import ExploreAllgamesController from './exploreAllgamesController';
// import ExploreGamesController from './exploreGamesController';
// import MenuMobileController from './menuMobileController';
// import AbilitiesController from './abilitesController';
// import SkinsController from './skinsController';
// import Skins2Controller from './skins2Controller';
// import RuinedController from './ruinedController';
// import GalleryController from './galleryController';

// const warningController = new WarningController(warningView);

import {
  ModalView,
  SubwebView,
  ExploreAllgamesView as AllgamesView,
  ExploreGamesView as GamesView,
  MenuMobileView,
  AbilitiesView,
} from '../views';

import ModalController from './modalController';
import SubwebController from './subwebController';
import ExploreAllgamesController from './exploreAllgamesController';
import ExploreGamesController from './exploreGamesController';
import MenuMobileController from './menuMobileController';
import AbilitiesController from './abilitesController';

const modalController = new ModalController(ModalView);

function subwebInit() {
  const controller = new SubwebController(SubwebView);
  const {
    handleLazyLoadingImage,
    fetchVideo,
    renderVideoFirstTime,
    closeInstruction,
    fetchVideoAbort,
    handleVideoState,
    handleReplayVideo,
    handleSpeakerPower,
    handleSpeakerProgress,
  } = controller;

  SubwebView.addLazyLoadingImage(handleLazyLoadingImage);
  SubwebView.addFetchVideoHandler(fetchVideo);
  SubwebView.addPlayVideoHandler(
    renderVideoFirstTime.bind(controller, modalController.open)
  );
  SubwebView.addCloseInstructionHandler(
    closeInstruction.bind(controller, modalController.close)
  );
  SubwebView.addFetchVideoHandlerAbort(fetchVideoAbort);
  SubwebView.addControlVideoStateHandler(handleVideoState);
  SubwebView.addReplayVideoHandler(handleReplayVideo);
  SubwebView.addSpeakerPowerHandler(handleSpeakerPower);
  SubwebView.addSpeakerProgressHandler(...handleSpeakerProgress());
}

function exploreAllgamesInit() {
  const controller = new ExploreAllgamesController(AllgamesView);
  const { open, close, handleData, selectPosters, toggleLinks } = controller;

  AllgamesView.addOpenSidebarHandler(
    open.bind(controller, modalController.open)
  );
  AllgamesView.addCloseSidebarHandler(
    close.bind(controller, modalController.close)
  );
  AllgamesView.addFetchAndDisplayDataHandler(handleData);
  AllgamesView.addHoverSelectPostersHandler(selectPosters);
  AllgamesView.addOpenLinksHandler(toggleLinks);
}

function exploreGamesInit() {
  const controller = new ExploreGamesController(GamesView);
  const { open, close, handleData } = controller;

  GamesView.addOpenSidebarHandler(open.bind(controller, modalController.open));
  GamesView.addCloseSidebarHandler(
    close.bind(controller, modalController.close)
  );
  GamesView.addFetchAndDisplayDataHandler(handleData);
}

function menuMobileInit() {
  const controller = new MenuMobileController(MenuMobileView);
  const { open, close, toggle } = controller;

  MenuMobileView.addOpenMenuHandler(
    open.bind(controller, modalController.open)
  );
  MenuMobileView.addCloseMenuHandler(
    close.bind(controller, modalController.close)
  );
  MenuMobileView.addToggleUniverseMobile(toggle);
}

function abilitiesInit() {
  const { chooseSkill, handleData, playVideoFirstTime } =
    new AbilitiesController(AbilitiesView);

  AbilitiesView.addChooseSkillHander(chooseSkill);
  AbilitiesView.addReFetchHandler(handleData);
  AbilitiesView.addPlayVideoFirstTimeHandler(playVideoFirstTime);
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
  const { open, close } = modalController;
  const { handleMessages, registerAccept, registerDecline } = warningController;

  const modalActions = { open, close };
  const warningActions = {
    open: warningController.open,
    close: warningController.close,
    handleMessages,
    registerAccept,
    registerDecline,
  };

  const controller = new GalleryController(
    galleryView,
    modalActions,
    warningActions
  );

  galleryView.addIntersectionObserver(controller.handleData);
  galleryView.addChoosenOpenHandler(controller.galleryChoosenActions.open);
  galleryView.addChoosenCloseHandler(controller.galleryChoosenActions.close);
}

const inits = {
  subwebInit,
  exploreAllgamesInit,
  exploreGamesInit,
  menuMobileInit,
  abilitiesInit,
};
Object.values(inits).forEach(init => init.call(null));

// skinsInit();
// skins2Init();
// ruinedInit();
// galleryInit();
