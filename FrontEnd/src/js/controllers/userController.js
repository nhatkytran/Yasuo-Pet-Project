import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';

import {
  ANIMATION_TIMEOUT,
  CONTENT,
  LOADING,
  ERROR,
  TOAST_SUCCESS,
  TOAST_FAIL,
  ERROR_ABORT_CODE,
} from '../config';

import { AppError, catchAsync, isPasswordValid, kickout } from '../utils';

import store from '../models/store';
import userService from '../models/features/user/userService';
import { ACTIONS } from '../models/features/user/reducer';
import authService from '../models/features/auth/authService';

import ModalContentController from './modalContentController';

const filename = 'userController.js';

class UserController extends ModalContentController {
  #UserView;
  #ToastView;
  #handleOpenModal;
  #handleCloseModal;

  #informationAvatarFile = null;
  #informationAvatarFileOrigin = null;
  #informationAvatarReader = null;
  #informationAvatarCropper = null;
  #informationAvatarValid = false;
  #informationAvatarLoading = false;

  #accountSigninCurrentPassword = '';
  #accountSigninNewPassword = '';
  #accountSigninSubmitValid = false;
  #accountSigninSubmitLoading = false;

  constructor(UserView, ToastView, handleOpenModal, handleCloseModal) {
    super();
    this.#UserView = UserView;
    this.#ToastView = ToastView;
    this.#handleOpenModal = handleOpenModal;
    this.#handleCloseModal = handleCloseModal;
  }

  // General //////////

  handleData = catchAsync({
    filename,
    onProcess: async state => {
      if (state === 'log_in') {
        await userService.getData('/api/v1/users/me');
        store.dispatch(ACTIONS.setDataOk());

        const { username, photo } = store.state.user;
        this.#UserView.changeLook(username, photo);
      }

      if (state === 'log_out') store.dispatch(ACTIONS.setDataNotOk());
    },
    onError: error => authErrorShouldKickout(error, this.#ToastView),
  });

  handleOpenProfile = () => {
    if (!store.state.user.ok)
      return this.#ToastView.createToast({
        ...store.state.toast[TOAST_FAIL],
        content:
          "Couldn't load user data! Please refresh the page or sign in again.",
      });

    this.#UserView.scrollToTop();

    let intervalId = setInterval(() => {
      if (window.scrollY !== 0) return;
      clearInterval(intervalId);

      super.open(
        this.#handleOpenModal,
        this.#UserView.openProfile.bind(this.#UserView, store.state.user)
      );
    }, ANIMATION_TIMEOUT);
  };

  handleCloseProfile = () =>
    super.close(this.#handleCloseModal, this.#UserView.closeProfile);

  // Information //////////

  #resetInformationAvatarKit = () => {
    this.#informationAvatarFile = null;
    this.#informationAvatarFileOrigin = null;
    this.#informationAvatarReader = null;
    this.#informationAvatarCropper = null;
    this.#informationAvatarValid = false;
    this.#informationAvatarLoading = false;
  };

  handleInformationAvatarCancel = () => {
    if (this.#informationAvatarLoading) return;
    this.#resetInformationAvatarKit();
    this.#UserView.informationAvatarCancel();
  };

  #handleInformationAvatarAdjustOpen = () => {
    this.#UserView.informationAvatarAdjustToggle({ open: true });

    this.#informationAvatarCropper = new Cropper(
      this.#UserView.informationAvatarAdjustImageGetter(),
      {
        aspectRatio: 1,
        viewMode: 3,
        preview: this.#UserView.informationAvatarPreviewClassGetter(),
      }
    );
  };

  handleInformationAvatarAdjustClose = ({ save = false }) => {
    this.#UserView.informationAvatarAdjustToggle({ open: false });
    this.#informationAvatarCropper.destroy();
    !save && this.handleInformationAvatarCancel();
  };

  handleInformationAvatarChooseFile = file => {
    if (!file.type.startsWith('image/')) {
      this.#ToastView.createToast({
        ...store.state.toast[TOAST_FAIL],
        content: 'Image type is required!',
      });
      return this.handleInformationAvatarCancel();
    }

    this.#informationAvatarReader = new FileReader();

    this.#informationAvatarReader.onload = () => {
      const url = this.#informationAvatarReader.result;
      this.#UserView.informationAvatarAdjustImage({ url });
      this.#handleInformationAvatarAdjustOpen();
      this.#informationAvatarFileOrigin = file;
    };

    this.#informationAvatarReader.readAsDataURL(file);
  };

  handleInformationAvatarSaveFile = () => {
    if (!this.#informationAvatarReader || !this.#informationAvatarCropper) {
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
      return this.handleInformationAvatarCancel();
    }

    this.#informationAvatarCropper
      .getCroppedCanvas({ width: 252, height: 252 })
      .toBlob(blob => {
        const reader = new FileReader();
        const { type, name } = this.#informationAvatarFileOrigin;
        const file = new File([blob], name, { type });

        reader.onloadend = () => {
          this.handleInformationAvatarAdjustClose({ save: true });
          this.#informationAvatarValid = true;
          this.#informationAvatarFile = file;
          this.#UserView.informationAvatarReady(reader.result);
        };

        reader.readAsDataURL(blob);
      });
  };

  handleInformationAvatarUploadFile = catchAsync({
    filename,
    onProcess: async () => {
      if (!this.#informationAvatarValid || this.#informationAvatarLoading)
        return;

      this.#informationAvatarLoading = true;
      this.#UserView.informationAvatarActionDisplay({ state: LOADING });

      await userService.changeAvatar(
        '/api/v1/users/changeAvatar',
        this.#informationAvatarFile
      );

      this.#informationAvatarLoading = false;
      this.#UserView.informationAvatarMainImageSrcSetter(
        store.state.user.photo
      );
      this.handleInformationAvatarCancel();
      this.#UserView.informationAvatarActionDisplay({ state: CONTENT });

      this.#ToastView.createToast({
        ...store.state.toast[TOAST_SUCCESS],
        content: 'Avatar changed successfully!',
      });
    },
    onError: error => {
      this.#informationAvatarLoading = false;
      this.#UserView.informationAvatarActionDisplay({ state: ERROR });

      if (error.response) {
        const { code } = error.response.data;

        if (code === 'AUTHENTICATION_ERROR')
          return kickout({
            createToast: this.#ToastView.createToast,
            success: false,
            message:
              'Please sign in to get access! Page will refresh in 5 seconds.',
          });
      }

      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  // Riot Account Sign-in //////////

  #checkAccountSigninSubmitValid = () =>
    isPasswordValid(this.#accountSigninCurrentPassword) &&
    isPasswordValid(this.#accountSigninNewPassword);

  #checkAccountSigninHasData = () =>
    Boolean(this.#accountSigninCurrentPassword) ||
    Boolean(this.#accountSigninNewPassword);

  #checkAccountSigninNoHaveData = () =>
    !(
      Boolean(this.#accountSigninCurrentPassword) ||
      Boolean(this.#accountSigninNewPassword)
    );

  #resetAccountSigninInputsKit = () =>
    ['current_password', 'new_password'].forEach(field =>
      this.#UserView.accountSigninWarningMessage({
        isError: false,
        field: field,
      })
    );

  #accountSigninBlurPasswordFactory = passwordType => () => {
    if (this.#checkAccountSigninNoHaveData())
      return this.#resetAccountSigninInputsKit();

    let password;
    if (passwordType === 'current_password')
      password = this.#accountSigninCurrentPassword;
    if (passwordType === 'new_password')
      password = this.#accountSigninNewPassword;

    !isPasswordValid(password) &&
      this.#UserView.accountSigninWarningMessage({
        isError: true,
        field: passwordType,
      });
  };

  handleAccountSigninEnterCurrentPassword = currentPassword => {
    this.#UserView.accountSigninWarningMessage({
      isError: false,
      field: 'current_password',
    });
    this.#accountSigninCurrentPassword = currentPassword.trim();
    this.#accountSigninSubmitValid = this.#checkAccountSigninSubmitValid();
    this.#UserView.accountSigninButtonDisplay({
      hasData: this.#checkAccountSigninHasData(),
      canSubmit: this.#accountSigninSubmitValid,
    });
  };

  handleAccountSigninBlurCurrentPassword =
    this.#accountSigninBlurPasswordFactory('current_password');

  handleAccountSigninEnterNewPassword = newPassword => {
    this.#UserView.accountSigninWarningMessage({
      isError: false,
      field: 'new_password',
    });
    this.#accountSigninNewPassword = newPassword.trim();
    this.#accountSigninSubmitValid = this.#checkAccountSigninSubmitValid();
    this.#UserView.accountSigninButtonDisplay({
      hasData: this.#checkAccountSigninHasData(),
      canSubmit: this.#accountSigninSubmitValid,
    });
  };

  handleAccountSigninBlurNewPassword =
    this.#accountSigninBlurPasswordFactory('new_password');

  handleAccountSigninCurrentPasswordType = () =>
    this.#UserView.accountSigninCurrentPasswordTypeDisplay();

  handleAccountSigninNewPasswordType = () =>
    this.#UserView.accountSigninNewPasswordTypeDisplay();

  #resetAccountSigninSubmitKit = () => {
    this.#accountSigninCurrentPassword = '';
    this.#accountSigninNewPassword = '';
    this.#accountSigninSubmitValid = false;
    this.#accountSigninSubmitLoading = false;
  };

  handleAccountSigninSubmit = catchAsync({
    filename,
    onProcess: async () => {
      if (!this.#accountSigninSubmitValid || this.#accountSigninSubmitLoading)
        return;

      this.#accountSigninSubmitLoading = true;
      this.#UserView.accountSigninActionDisplay({ state: LOADING });

      await authService.changePassword({
        email: store.state.user.email,
        currentPassword: this.#accountSigninCurrentPassword,
        newPassword: this.#accountSigninNewPassword,
      });

      this.#UserView.accountSigninActionDisplay({ state: CONTENT });
      this.#resetAccountSigninSubmitKit();

      kickout({
        createToast: this.#ToastView.createToast,
        success: true,
        message:
          'Password changed successfully! Page will refresh in 5 seconds.',
      });
    },
    onError: error => {
      this.#accountSigninSubmitLoading = false;

      if (error.code === ERROR_ABORT_CODE) {
        this.#resetAccountSigninSubmitKit();
        return this.#UserView.accountSigninActionDisplay({ state: CONTENT });
      }

      let errorMessage = 'Something went wrong! Please try again.';

      if (error.response) {
        const { code, message } = error.response.data;
        [
          'CHANGE_PASSWORD_SAME_ERROR',
          'CHANGE_PASSWORD_INCORRECT_ERROR',
        ].includes(code) && (errorMessage = message);
      }

      this.#UserView.accountSigninActionDisplay({ state: ERROR, errorMessage });

      if (error.response) {
        const { code } = error.response.data;

        if (code === 'AUTHENTICATION_ERROR')
          return kickout({
            createToast: this.#ToastView.createToast,
            success: false,
            message:
              'Please sign in to get access! Page will refresh in 5 seconds.',
          });
      }

      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  handleAccountSigninSubmitCancel = () => {
    if (this.#accountSigninSubmitLoading) return;
    this.#resetAccountSigninSubmitKit();
    this.#UserView.accountSigninSubmitCancel();
  };

  // Purchased Skins //////////

  handlePurSkinsViewCode = catchAsync({
    filename,
    onProcess: async skinIndex => {
      userService.checkIsLoggedInAbort();

      const skin = store.state.user.purchasedSkins.find(
        skn => skn.index === skinIndex
      );

      this.#UserView.purSkinsChooseSkinItem(skinIndex);
      this.#UserView.purSkinsActionDisplay({ skin, state: LOADING });

      const { isLoggedIn, errorType } = await userService.checkIsLoggedIn();

      if (!isLoggedIn) {
        if (errorType === ERROR_ABORT_CODE) throw new AppError({ errorType });
        throw new AppError({ authError: true });
      }

      // This is not a good practice because people can use the debugger to see
      // user's data, this is just a tamporary solution
      this.#UserView.purSkinsActionDisplay({ skin, state: CONTENT });
    },
    onError: error => {
      if (error.errorType === ERROR_ABORT_CODE) return;

      this.#UserView.purSkinsActionDisplay({ skin: null, state: ERROR });

      if (error.authError)
        return kickout({
          createToast: this.#ToastView.createToast,
          success: false,
          message:
            'Please sign in to get access! Page will refresh in 5 seconds.',
        });

      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });
}

export default UserController;
