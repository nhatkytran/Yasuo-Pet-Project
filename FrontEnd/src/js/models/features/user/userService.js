import { ERROR_ABORT_CODE } from '../../../config';
import { checkAbortError } from '../../../utils';
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

const changeAvatar = async (endpoint, file) => {
  const form = new FormData();
  form.append('photo', file);

  const { data } = await axiosInstance.post(endpoint, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  store.dispatch(ACTIONS.setUserPhoto(data.photo));
};

const purchaseSkin = async endpoint => {
  const { data } = await axiosInstance.get(endpoint);
  // No need to sync user's data, purchase action will refresh the page again
  return data.session;
};

let isLoggedInAbortController;

const checkIsLoggedIn = async () => {
  try {
    await axiosInstance.get('/api/v1/users/checkIsLoggedIn', {
      signal: (() => {
        isLoggedInAbortController = new AbortController();
        return isLoggedInAbortController.signal;
      })(),
    });

    return { isLoggedIn: true };
  } catch (error) {
    const errorType = checkAbortError(error) ? ERROR_ABORT_CODE : '';
    return { isLoggedIn: false, errorType };
  }
};

const checkIsLoggedInAbort = () => isLoggedInAbortController?.abort();

const userService = {
  getData,
  changeAvatar,
  purchaseSkin,
  checkIsLoggedIn,
  checkIsLoggedInAbort,
};
export default userService;
