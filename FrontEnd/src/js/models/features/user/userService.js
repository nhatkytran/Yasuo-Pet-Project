import axiosInstance from '../../axios';
import store from '../../store';
import { ACTIONS } from './reducer';

const getData = async endpoint => {
  const data = await axiosInstance.get(endpoint);
  const { user } = data.data;

  user.id = user['_id'];
  delete user['_id'];
  delete user['__v'];

  store.dispatch(ACTIONS.getData(user));
};

const userService = { getData };
export default userService;
