import axiosInstance from './axios';
import { catchAsync } from '../helpers';

let abortController;

const newAbortSignal = () => {
  abortController = new AbortController();
  return abortController.signal;
};

const getTrailerVideo = catchAsync(async endpoint => {
  const { data } = await axiosInstance.get(endpoint, {
    signal: newAbortSignal(),
  });

  return data;
});

const getTrailerVideoAbort = () => {
  if (abortController) abortController.abort();
};

const subwebAxios = { getTrailerVideo, getTrailerVideoAbort };

export default subwebAxios;
