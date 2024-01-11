const express = require('express');
const passport = require('passport');

const {
  signup,
  login,
  loginGoogleSuccess,
  checkIsLoggedIn,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const {
  getMe,
  getActivateCode,
  activateAccount,
  forgotUsername,
} = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', passport.authenticate('local'), login);

userRouter.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
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

userRouter.post('/forgotPassword', forgotPassword);
userRouter.post('/resetPassword/:email/:token', resetPassword);

userRouter.post('/forgotUsername', forgotUsername);

userRouter.get('/me', getMe);

module.exports = userRouter;
