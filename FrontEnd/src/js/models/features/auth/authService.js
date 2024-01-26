import axiosInstance from '../../axios';

const getBasicRoute = () => async endpoint => await axiosInstance.get(endpoint);

const postRoute = fields => {
  let abortController;

  const mainFunc = async (endpoint, fieldValues) => {
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

const { mainFunc: login, abortFunc: loginAbort } = postRoute([
  'username',
  'password',
]);

const checkIsLoggedIn = getBasicRoute();

// Sign-out //////////

const logout = getBasicRoute();

// Activate //////////

const { mainFunc: activateGetCode, abortFunc: activateGetCodeAbort } =
  postRoute(['email']);

const { mainFunc: activateConfirmCode, abortFunc: activateConfirmCodeAbort } =
  postRoute(['token']);

// Forgot name //////////

const { mainFunc: forgotName, abortFunc: forgotNameAbort } = postRoute([
  'email',
]);

// Forgot password //////////

const { mainFunc: forgotPassword, abortFunc: forgotPasswordAbort } = postRoute([
  'email',
]);

const { mainFunc: forgotPasswordReset, abortFunc: forgotPasswordResetAbort } =
  postRoute(['token', 'newPassword']);

// Sign-up //////////

const { mainFunc: signup, abortFunc: signupAbort } = postRoute([
  'username',
  'email',
  'password',
  'passwordConfirm',
]);

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
  forgotPassword,
  forgotPasswordAbort,
  forgotPasswordReset,
  forgotPasswordResetAbort,
  signup,
  signupAbort,
};

export default authService;
