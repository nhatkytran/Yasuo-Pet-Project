const express = require('express');
const passport = require('passport');

const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const userRouter = express.Router();

userRouter.post('/signup', signup);
userRouter.post('/login', passport.authenticate('local'), login);
userRouter.post('/logout', logout);
userRouter.post('/forgotPassword', forgotPassword);
userRouter.post('/resetPassword/:email/:token', resetPassword);

module.exports = userRouter;
