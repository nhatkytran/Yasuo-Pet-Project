import { ADD, REMOVE, CONTENT, LOADING, ERROR } from '../config';
import { $ } from '../utils';

const enabledCssEffect = `opacity: 1; cursor: pointer;`;
const disabledCssEffect = `opacity: 0.6; cursor: not-allowed;`;

class SoloView {
  #nameInput = $('#solo-name');
  #emailInput = $('#solo-email');
  #nameLabel = $('.solo-name-label');
  #emailLabel = $('.solo-email-label');

  #submitButton = $('.solo-form__button');

  #warningMessageError = (isError, element, message) => {
    element.classList[isError ? ADD : REMOVE]('error');
    element.textContent = message;
  };

  warningMessage = ({ isError, field, customMessage }) => {
    console.log(customMessage);
    if (field === 'name')
      this.#warningMessageError(
        isError,
        this.#nameLabel,
        customMessage ||
          (isError
            ? 'In-game name must be 5+ characters!'
            : 'Your in-game name')
      );
    if (field === 'email')
      this.#warningMessageError(
        isError,
        this.#emailLabel,
        customMessage ||
          (isError ? 'Please provide a valid email!' : "Challengee's email")
      );
  };

  buttonDisplay = ({ canSubmit }) =>
    (this.#submitButton.style.cssText = canSubmit
      ? enabledCssEffect
      : disabledCssEffect);

  actionDisplay = ({ state }) => {
    const inputs = [this.#nameInput, this.#emailInput];

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
      [this.#nameInput, this.#emailInput].forEach((input, index) =>
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
