import { ADD, REMOVE, CONTENT, LOADING, ERROR } from '../config';
import { $ } from '../utils';

const enabledCssEffect = `opacity: 1; cursor: pointer;`;
const disabledCssEffect = `opacity: 0.6; cursor: not-allowed;`;

class SoloView {
  #messageInput = $('#solo-message');
  #emailInput = $('#solo-email');
  #messageLabel = $('.solo-message-label');
  #emailLabel = $('.solo-email-label');
  #submitButton = $('.solo-form__button');

  #warningMessageError = (isError, element, message) => {
    element.classList[isError ? ADD : REMOVE]('error');
    element.textContent = message;
  };

  warningMessage = ({ isError, field, customMessage }) => {
    if (field === 'message')
      this.#warningMessageError(
        isError,
        this.#messageLabel,
        customMessage ||
          (isError
            ? "You message's max length is 300 characters!"
            : 'Your message')
      );
    if (field === 'email')
      this.#warningMessageError(
        isError,
        this.#emailLabel,
        customMessage ||
          (isError ? 'Please provide a valid email!' : "Opponent's email")
      );
  };

  buttonDisplay = ({ canSubmit }) =>
    (this.#submitButton.style.cssText = canSubmit
      ? enabledCssEffect
      : disabledCssEffect);

  actionDisplay = ({ state }) => {
    const inputs = [this.#messageInput, this.#emailInput];

    if (state === LOADING) {
      inputs.forEach(input => {
        input.disabled = true;
        input.style.cssText = disabledCssEffect;
      });
      return (this.#submitButton.style.cssText = disabledCssEffect);
    }

    inputs.forEach(input => {
      input.disabled = false;
      input.style.cssText = enabledCssEffect;
    });
    if (state === ERROR) this.#submitButton.style.cssText = enabledCssEffect;
    if (state === CONTENT) inputs.forEach(input => (input.value = ''));
  };

  // Events listening //////////

  addInputHandlers(handlers) {
    ['input', 'blur'].forEach((eventName, eventIndex) =>
      [this.#messageInput, this.#emailInput].forEach((input, index) =>
        input.addEventListener(eventName, event =>
          handlers[eventIndex][index](event.target.value)
        )
      )
    );
  }

  addSubmitHandler(handler) {
    this.#submitButton.addEventListener('click', event => {
      event.preventDefault();
      handler();
    });
  }
}

export default new SoloView();
