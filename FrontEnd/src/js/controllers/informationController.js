import { TOAST_INFORMATION } from '../config';
import store from '../models/store';

class InformationController {
  #InformationView;
  #ToastView;

  constructor(InformationView, ToastView) {
    this.#InformationView = InformationView;
    this.#ToastView = ToastView;
  }

  handleStartAnimation = () => {
    this.#ToastView.createToast(store.state.toast[TOAST_INFORMATION]);
    this.#InformationView.startAnimationObserve();
  };
}

export default InformationController;
