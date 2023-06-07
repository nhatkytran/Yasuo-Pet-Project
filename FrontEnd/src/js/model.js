import { subwebAxios, exploreAllgamesAxios } from './http';

const state = {
  videoTrailerLinks: {},
  isExploreAllgamesFetchData: false,
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

export const fetchExploreAllgamesDataAbort = async () =>
  await exploreAllgamesAxios.getExploreAllgamesDataAbort();

export default state;
