import {
  ModalView,
  WarningView,
  SubwebView,
  ExploreAllgamesView as AllgamesView,
  ExploreGamesView as GamesView,
  MenuMobileView,
  InformationView,
  AbilitiesView,
  SkinsView,
  Skins2View,
  RuinedView,
  GalleryView,
} from '../views';

import ModalController from './modalController';
import WarningController from './warningController';
import SubwebController from './subwebController';
import ExploreAllgamesController from './exploreAllgamesController';
import ExploreGamesController from './exploreGamesController';
import MenuMobileController from './menuMobileController';
import InformationController from './informationController';
import AbilitiesController from './abilitesController';
import SkinsController from './skinsController';
import Skins2Controller from './skins2Controller';
import RuinedController from './ruinedController';
import GalleryController from './galleryController';

const modalController = new ModalController(ModalView);
const warningController = new WarningController(WarningView);

function subwebInit() {
  const {
    handleLazyLoadingImage,
    fetchVideo,
    closeInstruction,
    fetchVideoAbort,
    handleVideoState,
    handleSpeakerPower,
    handleSpeakerProgress,
  } = new SubwebController(
    SubwebView,
    modalController.open,
    modalController.close
  );

  SubwebView.addLazyLoadingImage(handleLazyLoadingImage);
  SubwebView.addFetchVideoHandler(fetchVideo);
  SubwebView.addCloseInstructionHandler(closeInstruction);
  SubwebView.addFetchVideoHandlerAbort(fetchVideoAbort);
  SubwebView.addControlVideoStateHandler(handleVideoState);
  SubwebView.addSpeakerPowerHandler(handleSpeakerPower);
  SubwebView.addSpeakerProgressHandler(...handleSpeakerProgress());
}

function exploreAllgamesInit() {
  const { open, close, handleData, selectPosters, toggleLinks } =
    new ExploreAllgamesController(
      AllgamesView,
      modalController.open,
      modalController.close
    );

  AllgamesView.addOpenSidebarHandler(open);
  AllgamesView.addCloseSidebarHandler(close);
  AllgamesView.addFetchAndDisplayDataHandler(handleData);
  AllgamesView.addHoverSelectPostersHandler(selectPosters);
  AllgamesView.addOpenLinksHandler(toggleLinks);
}

function exploreGamesInit() {
  const { open, close, handleData } = new ExploreGamesController(
    GamesView,
    modalController.open,
    modalController.close
  );

  GamesView.addOpenSidebarHandler(open);
  GamesView.addCloseSidebarHandler(close);
  GamesView.addFetchAndDisplayDataHandler(handleData);
}

function menuMobileInit() {
  const { open, close, toggle } = new MenuMobileController(
    MenuMobileView,
    modalController.open,
    modalController.close
  );

  MenuMobileView.addOpenMenuHandler(open);
  MenuMobileView.addCloseMenuHandler(close);
  MenuMobileView.addToggleUniverseMobile(toggle);
}

function informationInit() {
  const { handleStartAnimation } = new InformationController(InformationView);
  InformationView.addIntersectionObserver(handleStartAnimation);
}

function abilitiesInit() {
  const { chooseSkill, playVideoFirstTime } = new AbilitiesController(
    AbilitiesView
  );

  AbilitiesView.addChooseSkillHander(chooseSkill);
  AbilitiesView.addRefetchHandler(chooseSkill);
  AbilitiesView.addPlayVideoFirstTimeHandler(playVideoFirstTime);
}

function skinsInit() {
  const { handleData, handleSlide, exploreSkins } = new SkinsController(
    SkinsView
  );

  SkinsView.addIntersectionObserver(handleData);
  SkinsView.addSlideHandler(handleSlide);
  SkinsView.addExploreSkinsHandler(exploreSkins);
}

function skins2Init() {
  const { handleData, slideActions, mbSlideActions } = new Skins2Controller(
    Skins2View
  );

  Skins2View.addIntersectionObserver(handleData);
  Skins2View.addChooseSlideHandler(slideActions.chooseSlide);
  Skins2View.addDragSlideHandler(
    slideActions.dragStart,
    slideActions.dragProgress,
    slideActions.dragStop
  );
  Skins2View.addChooseMbSlideHandler(mbSlideActions.chooseMbSlide);
  Skins2View.addDragMbSlideHandler(
    mbSlideActions.dragStart,
    mbSlideActions.dragProgress,
    mbSlideActions.dragStop
  );
  Skins2View.addMbSliderResizeHandler(mbSlideActions.resize);
}

function ruinedInit() {
  const { handleData } = new RuinedController(RuinedView);
  RuinedView.addIntersectionObserver(handleData);
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
    GalleryView,
    modalActions,
    warningActions
  );

  GalleryView.addIntersectionObserver(controller.handleData);
  GalleryView.addChoosenOpenHandler(controller.galleryChoosenActions.open);
  GalleryView.addChoosenCloseHandler(controller.galleryChoosenActions.close);
}

[
  // subwebInit,
  // exploreAllgamesInit,
  // exploreGamesInit,
  // menuMobileInit,
  // informationInit,
  // abilitiesInit,
  // skinsInit,
  // skins2Init,
  // ruinedInit,
  galleryInit,
].forEach(init => init.call(null));
