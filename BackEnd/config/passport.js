const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');

const { authenticationError } = require('../utils');
const { User } = require('../models');

const {
  NODE_ENV,
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_REDIRECT,
} = process.env;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
  algorithms: ['HS256'],
};

const jwtStrategy = new JWTStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id).select('+passwordChangedAt');

    if (!user)
      throw authenticationError(
        'The user belongs to this token does not longer exist!'
      );

    if (user.lastLogin.getTime() > payload.iat * 1000)
      throw authenticationError(
        'User recently issued new token! Please sign in again.'
      );

    if (user.changedPassword())
      throw authenticationError(
        'User recently changed password! Please sign in again.'
      );

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

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

passport.use(jwtStrategy);
passport.use(googleStrategy);
