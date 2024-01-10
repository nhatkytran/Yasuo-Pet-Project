import { catchAsync } from '../utils';
import { ANIMATION_TIMEOUT, TOAST_FAIL } from '../config';

import store from '../models/store';
import userService from '../models/features/user/userService';
import { ACTIONS } from '../models/features/user/reducer';

import ModalContentController from './modalContentController';

const filename = 'userController.js';

// Logout -> Set default username and default image -> profile
// Clear user's data when logout

class UserController extends ModalContentController {
  #UserView;
  #ToastView;
  #handleOpenModal;
  #handleCloseModal;

  constructor(UserView, ToastView, handleOpenModal, handleCloseModal) {
    super();
    this.#UserView = UserView;
    this.#ToastView = ToastView;
    this.#handleOpenModal = handleOpenModal;
    this.#handleCloseModal = handleCloseModal;
  }

  handleData = catchAsync({
    filename,
    onProcess: async () => {
      await userService.getData('/api/v1/users/me');
      store.dispatch(ACTIONS.setDataOk());

      const { username, photo } = store.state.user;
      this.#UserView.changeLook(username, photo);
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
}

export default UserController;
