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

  handleMessages = (options = {}) => {
    const { title, description, buttonMessage } = options;

    this.#warningView.changeMessages({
      title: title || 'Attention League of Legends Players',
      description: description || '',
      buttonMessage: buttonMessage || 'Accept',
    });
  };

  registerAccept = (abortController, callback) =>
    this.#warningView.addAcceptHandler(abortController, callback);

  registerDecline = (abortController, callback) =>
    this.#warningView.addDeclineHandler(abortController, callback);
}

export default WarningController;
