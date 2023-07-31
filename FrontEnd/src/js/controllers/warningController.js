class WarningController {
  #warningView;

  constructor(warningView) {
    this.#warningView = warningView;
  }

  open = () => {
    this.#warningView.open();
  };

  close = () => {
    this.#warningView.close();
  };

  handleMessages = ({ title, description, buttonMessage }) => {
    this.#warningView.changeMessages({
      title: title || 'Attention League of Legends Players',
      description: description || '',
      buttonMessage: buttonMessage || 'Accept',
    });
  };

  registerAccept = (abortController, callback) => {
    this.#warningView.addAcceptHandler(abortController, callback);
  };

  // Fix

  registerReject = (abortController, callback) => {
    this.#warningView.addRejectHandler(abortController, callback);
  };
}

export default WarningController;
