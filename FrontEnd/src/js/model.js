import { subwebAxios, exploreAllgamesAxios, exploreGamesAxios } from './http';

const createState = () => {
  const state = {
    videoTrailerLinks: {},
    _isExploreAllgamesFetchData: false,
    _isExploreGamesFetchData: false,
  };

  // Why set function like this instead of using `this` keyword in `state` object?
  // Because we pass function around, with this implementation we no need to bind this \
  // every time we pass function around
  // --> Can not use this --> Can not use setter and getter

  state.isExploreAllgamesFetchData = () => {
    return state._isExploreAllgamesFetchData;
  };
  state.setExploreAllgamesFetchData = value => {
    state._isExploreAllgamesFetchData = value;
  };

  state.isExploreGamesFetchData = () => {
    return state._isExploreGamesFetchData;
  };
  state.setExploreGamesFetchData = value => {
    state._isExploreGamesFetchData = value;
  };

  return state;
};

const state = createState();

// Subweb //////////////////////////////

export const fetchTrailerVideo = async () => {
  const response = await subwebAxios.getTrailerVideo('/api/v1/subweb/video');
  const { linkMp4, linkWebm } = response.video;

  state.videoTrailerLinks = { linkMp4, linkWebm };
};

export const fetchTrailerVideoAbort = () => subwebAxios.getTrailerVideoAbort();

// Explore Allgames //////////////////////////////

export const fetchExploreAllgamesData = async () => {
  const response = await exploreAllgamesAxios.getExploreAllgamesData(
    '/api/v1/allGames/data'
  );

  return response.allGamesAssets;
};

export const fetchExploreAllgamesDataAbort = () =>
  exploreAllgamesAxios.getExploreAllgamesDataAbort();

// Explore Games //////////////////////////////

export const fetchExploreGamesData = async () => {
  const response = await exploreGamesAxios.getExploreGamesData(
    '/api/v1/exploreGames/data'
  );

  return response.exploreGamesAssets;
};

export const fetchExploreGamesDataAbort = () =>
  exploreGamesAxios.getExploreGamesDataAbort();

export default state;
