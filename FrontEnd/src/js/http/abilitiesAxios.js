import axiosInstance from './axios';

let abortController;

const newAbortSignal = () => {
  abortController = new AbortController();
  return abortController.signal;
};

const getAbilitiesData = async endpoint => {
  const { data } = await axiosInstance.get(endpoint, {
    signal: newAbortSignal(),
  });

  return data;
};

const getAbilitiesDataAbort = () => {
  if (abortController) abortController.abort();
};

const abilitiesAxios = {
  getAbilitiesData,
  getAbilitiesDataAbort,
};

export default abilitiesAxios;
