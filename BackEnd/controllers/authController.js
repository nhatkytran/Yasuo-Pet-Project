const {
  AppError,
  catchAsync,
  sendEmail,
  isStrongPassword,
} = require('../utils');
const { User } = require('../models');

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
    const subject = 'Your activate token (only valid for 2 mins)';
    const message = `Your activate token: ${activateToken}`;

    await sendEmail({ email, subject, message });
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
  res.status(200).json({ status: 'success', user });
});

// passport.authenticate('local') verifyCallback function calls next(error)
exports.login = catchAsync(async (req, res, next) => {
  const { user } = req; // passport assigned user to req automatically

  user.lastLogin = Date.now();
  await user.save({ validateModifiedOnly: true });

  res.status(200).json({ status: 'success' });
});

exports.loginGoogleSuccess = catchAsync(async (req, res, next) => {
  const { user } = req;

  user.lastLogin = Date.now();
  await user.save({ validateModifiedOnly: true });

  // Test
  res.redirect('http://127.0.0.1:8080');
});

exports.checkIsLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.isAuthenticated())
    throw new AppError('You are not logged in yet!', 401);
  res.status(200).json({ status: 'success' });
});

exports.protect = (req, res, next) => {
  if (!req.isAuthenticated())
    throw new AppError('Please login to get access!', 401);
  next();
};

exports.logout = catchAsync(async (req, res, next) =>
  req.logout(error => {
    if (error)
      next(new AppError("Couldn't log out! Please try again later.", 500));
    else res.status(200).json({ status: 'success' });
  })
);
