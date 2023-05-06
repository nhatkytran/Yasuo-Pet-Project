import axiosInstance from './axios';
import { FETCH_API_TIMEOUT } from '../config';

// const newAbortSignal = () => {};
// { signal: newAbortSignal(FETCH_API_TIMEOUT * 1000) }

const getTrailerVideo = async endpoint => {
  try {
    const response = await axiosInstance.get(endpoint);

    return response.data;
  } catch (error) {
    throw error;
  }
};

const subwebAxios = { getTrailerVideo };

export default subwebAxios;
