import axiosInstance from './axios';

let abortController;

const newAbortSignal = () => {
  abortController = new AbortController();
  return abortController.signal;
};

const getExploreAllgamesData = async endpoint => {
  const { data } = await axiosInstance.get(endpoint, {
    signal: newAbortSignal(),
  });

  return data;
};

const getExploreAllgamesDataAbort = () => {
  if (abortController) abortController.abort();
};

const exploreAllgamesAxios = {
  getExploreAllgamesData,
  getExploreAllgamesDataAbort,
};

export default exploreAllgamesAxios;
