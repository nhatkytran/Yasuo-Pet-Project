import { catchAsync } from '../utils';

import store from '../models/store';
import userService from '../models/features/user/userService';
import { ACTIONS } from '../models/features/user/reducer';
import { TOAST_FAIL } from '../config';

const filename = 'userController.js';

// Logout -> Set default username and default image

class UserController {
  #UserView;
  #ToastView;

  constructor(UserView, ToastView) {
    this.#UserView = UserView;
    this.#ToastView = ToastView;
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

    console.log('Open profile!');
  };
}

export default UserController;
