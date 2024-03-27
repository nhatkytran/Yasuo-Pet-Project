const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const {
  AppError,
  Email,
  authenticationError,
  catchAsync,
  isStrongPassword,
  sendSuccess,
} = require('../utils');

const { User } = require('../models');

const { NODE_ENV, JWT_SECRET } = process.env;

exports.signup = catchAsync(async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;

  if (await User.findOne({ username }))
    throw new AppError(
      'Username already exists!',
      400,
      'SIGNUP_USERNAME_ERROR'
    );

  if (await User.findOne({ email }))
    throw new AppError('Email already exists!', 400, 'SIGNUP_EMAIL_ERROR');

  if (!username || !username.trim())
    throw new AppError('Please provide a username!', 400);
  if (!email || !email.trim())
    throw new AppError('Please provide an email!', 400);
  if (!password || !password.trim())
    throw new AppError('Please provide a password!', 400);
  if (!passwordConfirm || !passwordConfirm.trim())
    throw new AppError('Please confirm your password!', 400);

  if (!isStrongPassword(password))
    throw new AppError(
      'Password must contain at least 8 characters (1 uppercase, 1 lowercase, 1 number, 1 symbol)',
      400
    );

  if (password !== passwordConfirm)
    throw new AppError('Password confirm - Failed!', 400);

  const user = await User.create({
    username,
    email,
    password: String(password),
    passwordConfirm: String(passwordConfirm),
  });

  const activateToken = await user.createActivateToken();
  await user.save({ validateModifiedOnly: true });

  try {
    await new Email(user).sendWelcome({ oAuth: false, code: activateToken });
  } catch (error) {
    user.activateToken = undefined;
    user.activateTokenAt = undefined;

    await user.save({ validateModifiedOnly: true });

    throw new AppError(
      'Something went wrong sending email! Please activate account manually.',
      500,
      'SIGNUP_SEND_EMAIL_ERROR'
    );
  }

  user.password = undefined;
  sendSuccess(res, { metadata: { user } });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

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
    throw new AppError('Your account has been banned!', 403, 'LOGIN_BAN_ERROR');

  if (!user.active)
    throw new AppError(
      'You need to activate you account first!',
      401,
      'LOGIN_ACTIVE_ERROR'
    );

  const token = await jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: 30 * 24 * 60 * 60,
  });

  const { iat } = await jwt.verify(token, JWT_SECRET, { algorithm: 'HS256' });

  user.lastLogin = new Date(iat * 1000);
  await user.save({ validateModifiedOnly: true });

  sendSuccess(res, { metadata: { token } });
});

exports.loginGoogle = catchAsync(async (req, res, next) => {
  try {
    const { user } = req;

    // Send email can go wrong some times, no need to await here
    if (!user.lastLogin) new Email(user).sendWelcome({ oAuth: true });

    user.lastLogin = Date.now();
    await user.save({ validateModifiedOnly: true });

    res.redirect(
      NODE_ENV === 'development'
        ? 'http://127.0.0.1:8080'
        : 'https://yasuo-the-king.netlify.app/'
    );
  } catch (error) {
    error.oAuth = true;
    throw error;
  }
});

exports.checkIsLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.isAuthenticated())
    throw new AppError('You are not logged in yet!', 401);

  sendSuccess(res);
});

exports.protect = (req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (errorStrategy, user, errorToken) => {
      // errorStrategy -> errors thrown by the strategy
      // errorToken -> errors like invalid token, expired

      if (errorToken) {
        if (errorToken.name === 'TokenExpiredError')
          return next(
            authenticationError('Token has expired! Please login again.')
          );

        if (errorToken.name === 'JsonWebTokenError')
          return next(
            authenticationError('Invalid token! Please login again.')
          );

        return next(errorToken);
      }

      // Handled by strategy
      // 1. User does no longer exist
      // 2. User changed password after
      // 3. User did issue new jwt
      if (errorStrategy) return next(errorStrategy);

      req.user = user;
      next();
    }
  )(req, res, next);
};

exports.logout = catchAsync(async (req, res, next) =>
  req.logout(error =>
    error
      ? next(new AppError("Couldn't log out! Please try again later.", 500))
      : sendSuccess(res)
  )
);
