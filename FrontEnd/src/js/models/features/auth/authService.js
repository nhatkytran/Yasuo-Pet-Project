import axiosInstance from '../../axios';

const getBasicRoute = () => async endpoint => await axiosInstance.get(endpoint);

// Sign-in //////////

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

// Sign-out //////////

const logout = getBasicRoute();

// Activate //////////

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

// Forgot name //////////

let forgotNameAbortController;

const forgotName = async (endpoint, { email }) =>
  await axiosInstance.post(
    endpoint,
    { email },
    {
      signal: (() => {
        forgotNameAbortController = new AbortController();
        return forgotNameAbortController.signal;
      })(),
    }
  );

const forgotNameAbort = () => forgotNameAbortController?.abort();

const authService = {
  login,
  loginAbort,
  checkIsLoggedIn,
  logout,
  activateGetCode,
  activateGetCodeAbort,
  activateConfirmCode,
  activateConfirmCodeAbort,
  forgotName,
  forgotNameAbort,
};

export default authService;
