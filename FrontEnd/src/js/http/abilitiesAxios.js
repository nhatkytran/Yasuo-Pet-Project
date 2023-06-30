import axiosInstance from './axios';

let abortController;

const newAbortSignal = () => {
  abortController = new AbortController();
  return abortController.signal;
};

const getAbilitesData = async endpoint => {
  const { data } = await axiosInstance.get(endpoint, {
    signal: newAbortSignal(),
  });

  return data;
};

const getAbilitesDataAbort = () => {
  if (abortController) abortController.abort();
};

const abilitiesAxios = {
  getAbilitesData,
  getAbilitesDataAbort,
};

export default abilitiesAxios;
