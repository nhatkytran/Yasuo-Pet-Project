import {
  ModalView,
  WarningView,
  ToastView,
  AuthView,
  UserView,
  PurchaseView,
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
import ToastController from './toastController';
import AuthController from './authController';
import UserController from './userController';
import PurchaseController from './purchaseController';
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
const warningController = new WarningController(
  WarningView,
  modalController.open,
  modalController.close
);

function toastInit() {
  const { handleClearToast, handleWelcomeToast } = new ToastController(
    ToastView
  );

  ToastView.addClearToastHandler(handleClearToast);
  ToastView.addWelcomeToastHandler(handleWelcomeToast);
}

function authInit() {
  const {
    handleLoginCheckFirst,
    handleLoginOpen,
    handleLoginClose,
    handleLoginWarning,
    handleLoginEnterUsername,
    handleLoginEnterPassword,
    handleLoginBlurUsername,
    handleLoginBlurPassword,
    handleLoginPasswordType,
    handleLogin,
    handleLoginSocial,
    handleLoginChooseActivate,
    handleLoginChooseForgotName,
    //
    handleLogout,
    //
    handleActivateClose,
    handleActivateWarning,
    handleActivateEnterEmail,
    handleActivateBlurEmail,
    handleActivateEnterCode,
    handleActivateBlurCode,
    handleActivate,
    handleActivateActionsBack,
    //
    handleForgotNameClose,
    handleForgotNameWarning,
    handleForgotNameEnterEmail,
    handleForgotNameBlurEmail,
    handleForgotName,
    //
    handleSignupWarning,
  } = new AuthController(
    AuthView,
    ToastView,
    modalController.open,
    modalController.close
  );

  AuthView.addLoginCheckFirst(handleLoginCheckFirst);
  AuthView.addLoginOpenHandler(handleLoginOpen);
  AuthView.addLoginCloseHandler(handleLoginClose);
  AuthView.addLoginWarningHanler(handleLoginWarning);
  AuthView.addLoginInputHandlers([
    [handleLoginEnterUsername, handleLoginEnterPassword],
    [handleLoginBlurUsername, handleLoginBlurPassword],
  ]);
  AuthView.addLoginPasswordTypeHandler(handleLoginPasswordType);
  AuthView.addLoginHandler(handleLogin);
  AuthView.addLoginSocialHandler(handleLoginSocial);
  AuthView.addLoginChooseActivateHandler(handleLoginChooseActivate);
  AuthView.addLoginChooseForgotNameHandler(handleLoginChooseForgotName);

  AuthView.addLogoutHandler(handleLogout);

  AuthView.addActivateCloseHandler(handleActivateClose);
  AuthView.addActivateWarningHanler(handleActivateWarning);
  AuthView.addActivateInputHandlers([
    [handleActivateEnterEmail, handleActivateEnterCode],
    [handleActivateBlurEmail, handleActivateBlurCode],
  ]);
  AuthView.addActivateHandler(handleActivate);
  AuthView.addActivateActionsBackHandler(handleActivateActionsBack);

  AuthView.addForgotNameCloseHandler(handleForgotNameClose);
  AuthView.addForgotNameWarningHandler(handleForgotNameWarning);
  AuthView.addForgotNameInputEmailHandler([
    handleForgotNameEnterEmail,
    handleForgotNameBlurEmail,
  ]);
  AuthView.addForgotNameHandler(handleForgotName);

  AuthView.addSignupWarningHanler(handleSignupWarning);
}

function userInit() {
  const { handleData, handleOpenProfile, handleCloseProfile } =
    new UserController(
      UserView,
      ToastView,
      modalController.open,
      modalController.close
    );

  UserView.addDataHandler(handleData);
  UserView.addOpenProfileHandler(handleOpenProfile);
  UserView.addCloseProfileHandler(handleCloseProfile);
  UserView.addSidebarHandler(() => {});
}

function purchaseInit() {
  const {
    handleData,
    handleOpenPurchaseView,
    handleClosePurchaseView,
    handleSkinRelates,
  } = new PurchaseController(PurchaseView, ToastView);

  PurchaseView.addFetchDataHandler(handleData);
  PurchaseView.addOpenPurchaseViewHandler(handleOpenPurchaseView);
  PurchaseView.addClosePurchaseViewHandler(handleClosePurchaseView);
  PurchaseView.addSkinRealatesHandler(handleSkinRelates);
}

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
  const { handleData, explore } = new RuinedController(
    RuinedView,
    warningController.framework
  );

  RuinedView.addIntersectionObserver(handleData);
  RuinedView.addExploreHandler(explore);
}

function galleryInit() {
  const { handleData, chooseGallery } = new GalleryController(
    GalleryView,
    warningController.framework
  );

  GalleryView.addIntersectionObserver(handleData);
  GalleryView.addChooseGalleryHandler(chooseGallery);
}

[
  toastInit,
  authInit,
  userInit,
  // purchaseInit,
  subwebInit,
  // exploreAllgamesInit,
  // exploreGamesInit,
  // menuMobileInit,
  // informationInit,
  // abilitiesInit,
  // skinsInit,
  // skins2Init,
  // ruinedInit,
  // galleryInit,
].forEach(init => init.call(null));
