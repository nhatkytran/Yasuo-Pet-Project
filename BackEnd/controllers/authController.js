const crypto = require('crypto');
const validator = require('validator');
const { AppError, catchAsync, sendEmail } = require('../utils');
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

  return res.status(200).json({ status: 'success' });

  if (!username || !username.trim())
    throw new AppError('Please provide a username!', 400);
  if (!email || !email.trim())
    throw new AppError('Please provide an email!', 400);
  if (!password || !password.trim())
    throw new AppError('Please provide a password!', 400);
  if (!passwordConfirm || !passwordConfirm.trim())
    throw new AppError('Please confirm your password!', 400);

  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minUppercase: 1,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  )
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

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) throw new AppError('Please provide an email!', 400);
  if (!validator.isEmail(email))
    throw new AppError('Please provide a valid email!', 400);

  const user = await User.findOne({ email });
  if (!user) throw new AppError(`User not found with email: ${email}`);

  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateModifiedOnly: true });

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${email}/${resetToken}`;
    const subject = 'Your password reset token (only valid for 10 mins)';
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    await sendEmail({ email, subject, message });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateModifiedOnly: true });

    throw new AppError(
      'Something went wrong sending email! Please try again.',
      500
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token has been sent, please check your email',
  });
});

exports.resetPassword = catchAsync(async (req, res) => {
  const { email, token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    email,
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    throw new AppError('Invalid email - token or token has expired!', 401);

  const { password, passwordConfirm } = req.body;

  if (!password || !passwordConfirm)
    throw new AppError('Please provide password and passwordConfirm!', 400);

  // 3. Reset password
  user.password = String(password);
  user.passwordConfirm = String(passwordConfirm);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    message: 'Reset password successfully!',
  });
});
