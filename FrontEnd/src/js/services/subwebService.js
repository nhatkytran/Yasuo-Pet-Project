import axiosInstance from './axios';
import store from '../models/store';
import { ACTIONS } from '../models/features/subweb/reducer';

let abortController;

const getVideo = async endpoint => {
  const { data } = await axiosInstance.get(endpoint, {
    signal: (() => {
      abortController = new AbortController();
      return abortController.signal;
    })(),
  });

  const { linkMp4, linkWebm } = data.video;
  store.dispatch(ACTIONS.getVideo({ linkMp4, linkWebm }));
};

const getVideoAbort = () => abortController?.abort();

const subwebService = { getVideo, getVideoAbort };
export default subwebService;
