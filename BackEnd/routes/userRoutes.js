const express = require('express');
const passport = require('passport');

const {
  signup,
  login,
  loginGoogle,
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
  getCheckoutState,
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

// Failure handled by in passport config and errorController
// error.oAuth = true
userRouter.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  loginGoogle
);

userRouter.get('/checkIsLoggedIn', checkIsLoggedIn);

userRouter.post('/activateCode', getActivateCode);
userRouter.post('/activate', activateAccount);

userRouter.post('/forgotUsername', forgotUsername);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.post('/resetPassword', resetPassword);

userRouter.use(protect);

userRouter.get('/logout', logout);

userRouter.post(
  '/changeAvatar',
  uploadUserPhoto,
  resizeUserPhoto,
  deleteOldUserPhoto,
  changePhoto
);

userRouter.post('/changePassword', changePassword);

userRouter.get('/me', getMe);
userRouter.post('/solo', sendSolo);

userRouter.get('/checkoutSession/:skinIndex', getCheckoutSession);

userRouter.get(
  '/checkout/:state/:skinIndexParam/:skinReceiptParam?',

  getCheckoutState
);

module.exports = userRouter;
