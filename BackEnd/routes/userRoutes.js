const express = require('express');
const passport = require('passport');

const {
  signup,
  login,
  loginGoogleSuccess,
  loginGoogleFail,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const userRouter = express.Router();

userRouter.get('/test', (req, res) => {
  res.send(
    '<a href="http://127.0.0.1:3000/api/v1/users/auth/google">Login</a>'
  );
});

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
    failureRedirect: '/api/v1/users/loginGoogleFail',
  })
);

userRouter.get('/loginGoogleSuccess', loginGoogleSuccess);
userRouter.get('/loginGoogleFail', loginGoogleFail);

userRouter.post('/logout', logout);

userRouter.post('/forgotPassword', forgotPassword);
userRouter.post('/resetPassword/:email/:token', resetPassword);

module.exports = userRouter;
