import { TOAST_WELCOME } from '../config';
import store from '../models/store';

class ToastController {
  #ToastView;

  constructor(ToastView) {
    this.#ToastView = ToastView;
  }

  handleClearToast = element => this.#ToastView.clear(element);

  handleWelcomeToast = () =>
    this.#ToastView.createToast(store.state.toast[TOAST_WELCOME]);
}

export default ToastController;
