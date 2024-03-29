import axiosInstance from '../../axios';
import { BACKEND_URL } from '../../../config';

const usersRoute = endpoint => `/api/v1/users/${endpoint}`;

const postRoute = (endpoint, fields) => {
  let abortController;

  const mainFunc = async fieldValues => {
    const postData = fields.reduce((acc, field) => {
      acc[field] = fieldValues[field];
      return acc;
    }, {});

    return await axiosInstance.post(endpoint, postData, {
      signal: (() => {
        abortController = new AbortController();
        return abortController.signal;
      })(),
    });
  };

  const abortFunc = () => abortController?.abort();

  return { mainFunc, abortFunc };
};

// Sign-in //////////

const { mainFunc: login, abortFunc: loginAbort } = postRoute(
  usersRoute('login'),
  ['username', 'password']
);

const loginSocial = social =>
  (window.location.href = `${BACKEND_URL}${usersRoute(`auth/${social}`)}`);

// Google Authentication -> ?user=<userID>&code=<code>
// catchAsync
const checkAuthGoogle = async () => {
  try {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const userID = urlSearchParams.get('user');
    const code = urlSearchParams.get('code');

    if (!userID || !code) throw new Error();
  } catch (error) {}
};

const checkIsLoggedIn = async () => {
  try {
    await axiosInstance.get('/api/v1/users/checkIsLoggedIn');
    return true;
  } catch (error) {
    return false;
  }
};

// Sign-out //////////

const logout = () => localStorage.removeItem('ytk_jwt');

// Activate //////////

const { mainFunc: activateGetCode, abortFunc: activateGetCodeAbort } =
  postRoute(usersRoute('activateCode'), ['email']);

const { mainFunc: activateConfirmCode, abortFunc: activateConfirmCodeAbort } =
  postRoute(usersRoute('activate'), ['token']);

// Forgot name //////////

const { mainFunc: forgotName, abortFunc: forgotNameAbort } = postRoute(
  usersRoute('forgotUsername'),
  ['email']
);

// Forgot password //////////

const { mainFunc: forgotPassword, abortFunc: forgotPasswordAbort } = postRoute(
  usersRoute('forgotPassword'),
  ['email']
);

const { mainFunc: forgotPasswordReset, abortFunc: forgotPasswordResetAbort } =
  postRoute(usersRoute('resetPassword'), ['token', 'newPassword']);

// Sign-up //////////

const { mainFunc: signup, abortFunc: signupAbort } = postRoute(
  usersRoute('signup'),
  ['username', 'email', 'password', 'passwordConfirm']
);

// Send Solo

const { mainFunc: sendSolo } = postRoute(usersRoute('solo'), [
  'message',
  'opponentEmail',
]);

// Profile

const { mainFunc: changePassword } = postRoute(usersRoute('changePassword'), [
  'email',
  'currentPassword',
  'newPassword',
]);

//

const authService = {
  login,
  loginAbort,
  loginSocial,
  checkIsLoggedIn,
  logout,
  activateGetCode,
  activateGetCodeAbort,
  activateConfirmCode,
  activateConfirmCodeAbort,
  forgotName,
  forgotNameAbort,
  forgotPassword,
  forgotPasswordAbort,
  forgotPasswordReset,
  forgotPasswordResetAbort,
  signup,
  signupAbort,
  sendSolo,
  changePassword,
};

export default authService;
