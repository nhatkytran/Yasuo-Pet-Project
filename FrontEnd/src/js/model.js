import {
  subwebAxios,
  exploreAllgamesAxios,
  exploreGamesAxios,
  abilitiesAxios,
} from './http';

const state = {
  videoTrailerLinks: {},
  isExploreAllgamesFetchData: false,
  isExploreGamesFetchData: false,
  isAbilitiesFetchData: false,
};

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

// Abilities //////////////////////////////

export const fetchAbilitiesData = async () => {
  const response = await abilitiesAxios.getAbilitiesData(
    '/api/v1/abilities/data'
  );

  return response.abilitiesAssets;
};

export const fetchAbilitiesDataAbort = () =>
  abilitiesAxios.getAbilitiesDataAbort();

// //////////////////////////////

export default state;
