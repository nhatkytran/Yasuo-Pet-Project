import axiosInstance from './axios';

let abortController;

const newAbortSignal = () => {
  abortController = new AbortController();
  return abortController.signal;
};

const getExploreGamesData = async endpoint => {
  const { data } = await axiosInstance.get(endpoint, {
    signal: newAbortSignal(),
  });

  return data;
};

const getExploreGamesDataAbort = () => {
  if (abortController) abortController.abort();
};

const exploreGamesAxios = {
  getExploreGamesData,
  getExploreGamesDataAbort,
};

export default exploreGamesAxios;
