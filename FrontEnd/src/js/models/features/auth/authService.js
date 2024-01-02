import axiosInstance from '../../axios';

const getBasicRoute = () => async endpoint => await axiosInstance.get(endpoint);

//

let abortController;

const login = async (endpoint, { username, password }) =>
  await axiosInstance.post(
    endpoint,
    { username, password },
    {
      signal: (() => {
        abortController = new AbortController();
        return abortController.signal;
      })(),
    }
  );

const loginAbort = () => abortController?.abort();

const checkIsLoggedIn = getBasicRoute();

//

const logout = getBasicRoute();

const authService = { login, loginAbort, checkIsLoggedIn, logout };
export default authService;
