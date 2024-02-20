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

let changeAvatarAbortController;

const changeAvatar = async (endpoint, file) => {
  const form = new FormData();
  form.append('photo', file);

  const { data } = await axiosInstance.post(endpoint, form, {
    signal: (() => {
      changeAvatarAbortController = new AbortController();
      return changeAvatarAbortController.signal;
    })(),
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  store.dispatch(ACTIONS.setUserPhoto(data.photo));
};

const purchaseSkin = async endpoint => {
  const { data } = await axiosInstance.get(endpoint);
  return data.session;
  // No need to sync user's data, purchase action will refresh the page again
};

const userService = { getData, changeAvatar, purchaseSkin };
export default userService;
