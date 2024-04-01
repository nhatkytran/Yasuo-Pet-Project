const express = require('express');
const passport = require('passport');

const {
  signup,
  login,
  loginGoogleRedirect,
  loginGoogle,
  checkIsLoggedIn,
  protect,
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
userRouter.post('/login', login);

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
  passport.authenticate('google', { session: false }),
  loginGoogleRedirect
);

userRouter.get('/auth/google/login/:userID/:code', loginGoogle);

userRouter.post('/activateCode', getActivateCode);
userRouter.post('/activate', activateAccount);

userRouter.post('/forgotUsername', forgotUsername);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.post('/resetPassword', resetPassword);

userRouter.get(
  '/checkout/:userID/:state/:skinIndexParam/:skinReceiptParam?',
  getCheckoutState
);

// userRouter.use(protect); // Can cause unexpected errors

userRouter.get('/checkIsLoggedIn', protect, checkIsLoggedIn);

userRouter.post(
  '/changeAvatar',
  protect,
  uploadUserPhoto,
  resizeUserPhoto,
  deleteOldUserPhoto,
  changePhoto
);

userRouter.post('/changePassword', protect, changePassword);

userRouter.get('/me', protect, getMe);
userRouter.post('/solo', protect, sendSolo);

userRouter.get('/checkoutSession/:skinIndex', protect, getCheckoutSession);

module.exports = userRouter;
