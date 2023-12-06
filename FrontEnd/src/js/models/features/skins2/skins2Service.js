import axiosInstance from '../../axios';
import store from '../../store';
import { ACTIONS } from './reducer';

const getData = async endpoint => {
  const { data } = await axiosInstance.post(endpoint, {
    query: `query { skins { name releaseYear inCollection image } }`,
  });

  store.dispatch(ACTIONS.getData(data.data));
};

const skins2Service = { getData };
export default skins2Service;
