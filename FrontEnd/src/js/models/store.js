import { legacy_createStore as createStore, combineReducers } from 'redux';

import subwebReducer from './features/subweb/reducer';

class Store {
  #store;

  constructor() {
    this.#store = createStore(
      combineReducers({
        subweb: subwebReducer,
      })
    );
  }

  // Get all state
  get state() {
    return this.#store.getState();
  }

  // Get a specific state
  useState(callback) {
    return callback(this.#store.getState());
  }
}

const store = new Store();
export default store;
