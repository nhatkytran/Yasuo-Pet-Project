import { $ } from '../config.js';

class MainHeaderView {
  _parentElement = $('.main-header__cover');
  _rootObserved = $('.container');

  handleSticky(action) {
    switch (action) {
      case 'add':
        this._parentElement.classList.add('sticky');
        break;
      case 'remove':
        this._parentElement.classList.remove('sticky');
        break;
      default:
        throw new Error('Something went wrong!');
    }
  }

  _observerCallback(entries, _, handler) {
    handler(!entries[0].isIntersecting);
  }

  _observerCallbackMiddleware(handler) {
    return (state, observer) => {
      this._observerCallback(state, observer, handler);
    };
  }

  _observerOptions() {
    return {
      root: null,
      threshold: 0,
    };
  }

  addHandlerObserver(handler) {
    const observer = new IntersectionObserver(
      this._observerCallbackMiddleware(handler),
      this._observerOptions
    );

    observer.observe(this._rootObserved);
  }
}

export default new MainHeaderView();
