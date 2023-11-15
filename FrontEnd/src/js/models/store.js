import { legacy_createStore as createStore, combineReducers } from 'redux';

import subwebReducer from './features/subweb/reducer';
import allgamesReducer from './features/allgames/reducer';
import gamesReducer from './features/games/reducer';
import abilitiesReducer from './features/abilities/reducer';
import skinsReducer from './features/skins/reducer';

class Store {
  #store;

  constructor() {
    this.#store = createStore(
      combineReducers({
        subweb: subwebReducer,
        allgames: allgamesReducer,
        games: gamesReducer,
        abilities: abilitiesReducer,
        skins: skinsReducer,
      })
    );
  }

  dispatch(action) {
    this.#store.dispatch(action);
  }

  get state() {
    return this.#store.getState();
  }
}

const store = new Store();
export default store;
