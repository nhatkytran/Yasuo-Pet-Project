import axiosInstance from '../../axios';

const getBasicRoute = () => async endpoint => await axiosInstance.get(endpoint);

//

let loginAbortController;

const login = async (endpoint, { username, password }) =>
  await axiosInstance.post(
    endpoint,
    { username, password },
    {
      signal: (() => {
        loginAbortController = new AbortController();
        return loginAbortController.signal;
      })(),
    }
  );

const loginAbort = () => loginAbortController?.abort();

const checkIsLoggedIn = getBasicRoute();

//

const logout = getBasicRoute();

//

let activateGetCodeAbortController;

const activateGetCode = async (endpoint, { email }) =>
  await axiosInstance.post(
    endpoint,
    { email },
    {
      signal: (() => {
        activateGetCodeAbortController = new AbortController();
        return activateGetCodeAbortController.signal;
      })(),
    }
  );

const activateGetCodeAbort = () => activateGetCodeAbortController?.abort();

let activateConfirmCodeAbortController;

const activateConfirmCode = async (endpoint, { token }) =>
  await axiosInstance.post(
    endpoint,
    { token },
    {
      signal: (() => {
        activateConfirmCodeAbortController = new AbortController();
        return activateConfirmCodeAbortController.signal;
      })(),
    }
  );

const activateConfirmCodeAbort = () =>
  activateConfirmCodeAbortController?.abort();

const authService = {
  login,
  loginAbort,
  checkIsLoggedIn,
  logout,
  activateGetCode,
  activateGetCodeAbort,
  activateConfirmCode,
  activateConfirmCodeAbort,
};

export default authService;
