import axiosInstance from './axios';
import { FETCH_API_TIMEOUT } from '../config';
import { catchAsync } from '../helpers';

// const newAbortSignal = () => {};
// { signal: newAbortSignal(FETCH_API_TIMEOUT * 1000) }

const getTrailerVideo = catchAsync(async endpoint => {
  const { data } = await axiosInstance.get(endpoint);
  return data;
});

const subwebAxios = { getTrailerVideo };

export default subwebAxios;
