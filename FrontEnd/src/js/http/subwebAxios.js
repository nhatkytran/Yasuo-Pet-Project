import axiosInstance from './axios';

let abortController;

const getTrailerVideo = async endpoint => {
  const { data } = await axiosInstance.get(endpoint, {
    signal: (() => {
      abortController = new AbortController();
      return abortController.signal;
    })(),
  });

  return data;
};

const getTrailerVideoAbort = () => abortController?.abort();

const subwebAxios = { getTrailerVideo, getTrailerVideoAbort };
export default subwebAxios;
