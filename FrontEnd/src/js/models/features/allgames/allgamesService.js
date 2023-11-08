import axiosInstance from '../../axios';
import store from '../../store';
import { ACTIONS } from './reducer';

let abortController;

const getData = async endpoint => {
  const { data } = await axiosInstance.get(endpoint, {
    signal: (() => {
      abortController = new AbortController();
      return abortController.signal;
    })(),
  });

  store.dispatch(ACTIONS.getData(data.allGamesAssets));
};

const getDataAbort = () => abortController?.abort();

const allgamesService = { getData, getDataAbort };
export default allgamesService;
