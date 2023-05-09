import axiosInstance from './axios';
import { catchAsync } from '../helpers';

let abortController;

// const newAbortSignal = timeout => {
//   abortController = new AbortController();
//   return abortController.signal;
// };

const getTrailerVideo = catchAsync(async endpoint => {
  const { data } = await axiosInstance.get(endpoint);

  return data;
});

const subwebAxios = { getTrailerVideo };

export default subwebAxios;
