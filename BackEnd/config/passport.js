const passport = require('passport');
const passportLocal = require('passport-local');
const passportGoogle = require('passport-google-oauth20');
const bcrypt = require('bcrypt');
const { AppError } = require('../utils');
const { User } = require('../models');

const {
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_REDIRECT,
} = process.env;

const LocalStrategy = passportLocal.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

const localStrategy = new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  async (usernameParam, passwordParam, done) => {
    try {
      const username = String(usernameParam);
      const password = String(passwordParam);

      if (!username || !password)
        throw new AppError('Please provide username and password!', 400);

      const user = await User.findOne({ username }).select('+password');

      if (!user || !(await bcrypt.compare(password, user.password)))
        throw new AppError(
          'Incorrect username or password!',
          401,
          'LOGIN_AUTHENTICATION_ERROR'
        );

      if (user.ban)
        throw new AppError(
          'Your account has been banned!',
          403,
          'LOGIN_BAN_ERROR'
        );

      if (!user.active)
        throw new AppError(
          'You need to activate you account first!',
          401,
          'LOGIN_ACTIVE_ERROR'
        );

      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

let googleClientRedirect =
  'http://127.0.0.1:3000/api/v1/users/auth/google/callback';

if (NODE_ENV !== 'development') googleClientRedirect = GOOGLE_CLIENT_REDIRECT;

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: googleClientRedirect,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const {
        sub: googleID,
        name: username,
        email,
        picture: photo,
      } = profile._json;

      const user = await User.findOne({ email });

      if (user) return done(null, user);

      const newUser = await User.create({
        username: `${username}.google`,
        email,
        googleID,
        active: true,
        photo,
      });

      done(null, newUser);
    } catch (error) {
      // oAuth here is used bu errorController
      error.oAuth = true;
      done(error);
    }
  }
);

passport.use(localStrategy);
passport.use(googleStrategy);

passport.serializeUser((user, done) => done(null, user._id.toString()));

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId).select('+passwordChangedAt');

    if (
      !user ||
      (user.passwordChangedAt && user.lastLogin && user.changedPassword())
    )
      return done(null, false);

    done(null, user);
  } catch (error) {
    done(error);
  }
});
