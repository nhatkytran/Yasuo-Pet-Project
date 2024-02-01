import { catchAsync, isPasswordValid } from '../utils';

import {
  ANIMATION_TIMEOUT,
  CONTENT,
  LOADING,
  TOAST_SUCCESS,
  TOAST_FAIL,
  ERROR_ABORT_CODE,
  ERROR,
  CLEAR_TOAST_TIMEOUT,
} from '../config';

import store from '../models/store';
import userService from '../models/features/user/userService';
import { ACTIONS } from '../models/features/user/reducer';
import authService from '../models/features/auth/authService';

import ModalContentController from './modalContentController';

const filename = 'userController.js';

// Logout -> Set default username and default image -> profile
// Clear user's data when logout

class UserController extends ModalContentController {
  #UserView;
  #ToastView;
  #handleOpenModal;
  #handleCloseModal;

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
  });

  handleOpenProfile = () => {
    if (!store.state.user.ok)
      return this.#ToastView.createToast({
        ...store.state.toast[TOAST_FAIL],
        content:
          "Couldn't load user data! Please refresh the page or sign in again.",
      });

    this.#UserView.scrollToTop();

    setTimeout(
      () =>
        super.open(
          this.#handleOpenModal,
          this.#UserView.openProfile.bind(this.#UserView, store.state.user)
        ),
      ANIMATION_TIMEOUT
    );
  };

  handleCloseProfile = () =>
    super.close(this.#handleCloseModal, this.#UserView.closeProfile);

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

      setTimeout(() => window.location.reload(), CLEAR_TOAST_TIMEOUT);
      this.#ToastView.createToast(
        {
          ...store.state.toast[TOAST_SUCCESS],
          content:
            'Password changed successfully! Page will refresh in 5 seconds.',
        },
        true
      );
    },
    onError: error => {
      this.#accountSigninSubmitLoading = false;

      if (error.code === ERROR_ABORT_CODE) {
        this.#resetAccountSigninSubmitKit();
        return this.#UserView.accountSigninActionDisplay({ state: CONTENT });
      }

      let errorMessage = 'Something went wrong! Please try again.';

      // Check password
      if (error.response) {
        const { code, message } = error.response.data;
        [
          'CHANGE_PASSWORD_SAME_ERROR',
          'CHANGE_PASSWORD_INCORRECT_ERROR',
        ].includes(code) && (errorMessage = message);
      }

      this.#UserView.accountSigninActionDisplay({ state: ERROR, errorMessage });
      this.#ToastView.createToast(store.state.toast[TOAST_FAIL]);
    },
  });

  handleAccountSigninSubmitCancel = () => {
    if (this.#accountSigninSubmitLoading) return;
    this.#resetAccountSigninSubmitKit();
    this.#UserView.accountSigninSubmitCancel();
  };
}

export default UserController;
