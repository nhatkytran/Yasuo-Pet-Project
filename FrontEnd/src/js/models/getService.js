import axiosInstance from './axios';
import store from './store';

const getService = (ACTIONS, nameAssets) => {
  let abortController;

  const getData = async endpoint => {
    const { data } = await axiosInstance.get(endpoint, {
      signal: (() => {
        abortController = new AbortController();
        return abortController.signal;
      })(),
    });

    store.dispatch(ACTIONS.getData(data[nameAssets]));
  };

  const getDataAbort = () => abortController?.abort();

  return { getData, getDataAbort };
};

export default getService;
