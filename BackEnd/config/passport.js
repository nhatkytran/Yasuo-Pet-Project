const passport = require('passport');
const passportLocal = require('passport-local');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const { AppError } = require('../utils');

const LocalStrategy = passportLocal.Strategy;
const customFields = { usernameField: 'email', passwordField: 'password' };

const verifyCallback = async (emailParam, passwordParam, done) => {
  try {
    const email = String(emailParam);
    const password = String(passwordParam);

    if (!email || !password)
      throw new AppError('Please provide email and password!', 400);

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new AppError('Incorrect email or password!', 401);

    if (user.ban) throw new AppError('Your account has been banned!', 403);
    if (!user.active)
      throw new AppError('You need to activate you account first!', 401);

    user.lastLogin = Date.now();
    await user.save({ validateModifiedOnly: true });

    done(null, user);
  } catch (error) {
    done(error);
  }
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => done(null, user._id.toString()));

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await User.findById(userId);
    if (!user || user.changedPassword()) return done(null, false);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
