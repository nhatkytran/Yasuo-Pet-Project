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

  store.dispatch(ACTIONS.getData(data.exploreGamesAssets));
};

const getDataAbort = () => abortController?.abort();

const gamesService = { getData, getDataAbort };
export default gamesService;
