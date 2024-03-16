const {
  AppError,
  Email,
  catchAsync,
  sendSuccess,
  isStrongPassword,
} = require('../utils');

const { User } = require('../models');

const { NODE_ENV } = process.env;

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

// passport.authenticate('local') verifyCallback function calls next(error)
exports.login = catchAsync(async (req, res, next) => {
  const { user } = req; // passport assigned user to req automatically

  user.lastLogin = Date.now();
  await user.save({ validateModifiedOnly: true });

  sendSuccess(res);
});

exports.loginGoogleSuccess = catchAsync(async (req, res, next) => {
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
});

exports.loginGoogleFailure = (req, res, next) =>
  res.status(200).render('error');

exports.checkIsLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.isAuthenticated())
    throw new AppError('You are not logged in yet!', 401, '', false);

  sendSuccess(res);
});

exports.protect = (req, res, next) => {
  if (!req.isAuthenticated())
    throw new AppError('Please login to get access!', 401, '', false);

  next();
};

exports.logout = catchAsync(async (req, res, next) =>
  req.logout(error =>
    error
      ? next(new AppError("Couldn't log out! Please try again later.", 500))
      : sendSuccess(res)
  )
);
