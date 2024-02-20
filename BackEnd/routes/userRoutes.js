const express = require('express');
const passport = require('passport');

const {
  signup,
  login,
  loginGoogleSuccess,
  checkIsLoggedIn,
  protect,
  logout,
} = require('../controllers/authController');

const {
  getMe,
  sendSolo,
  getActivateCode,
  activateAccount,
  forgotUsername,
  forgotPassword,
  resetPassword,
  changePassword,
  uploadUserPhoto,
  resizeUserPhoto,
  deleteOldUserPhoto,
  changePhoto,
  getCheckoutSession,
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', passport.authenticate('local'), login);

userRouter.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  })
);

userRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: '/api/v1/users/loginGoogleSuccess',
  })
);

userRouter.get('/loginGoogleSuccess', loginGoogleSuccess);

userRouter.get('/checkIsLoggedIn', checkIsLoggedIn);

userRouter.get('/logout', logout);

userRouter.post('/activateCode', getActivateCode);
userRouter.post('/activate', activateAccount);

userRouter.post('/forgotUsername', forgotUsername);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.post('/resetPassword', resetPassword);

userRouter.post('/changePassword', changePassword);

userRouter.post(
  '/changeAvatar',
  protect,
  uploadUserPhoto,
  resizeUserPhoto,
  deleteOldUserPhoto,
  changePhoto
);

userRouter.get('/me', getMe);
userRouter.post('/solo', protect, sendSolo);

userRouter.get('/checkoutSuccess', (req, res, next) => {
  res.send('<h1>Success</h1>');
});
userRouter.get('/checkoutCancel', (req, res, next) => {
  res.send('<h1>Cancel</h1>');
});
userRouter.get('/checkoutSession/:skinIndex', getCheckoutSession);

module.exports = userRouter;
