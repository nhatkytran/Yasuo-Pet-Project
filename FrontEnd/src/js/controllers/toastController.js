class ToastController {
  #ToastView;

  constructor(ToastView) {
    this.#ToastView = ToastView;
  }

  handleClearToast = element => this.#ToastView.clear(element);
}

export default ToastController;
