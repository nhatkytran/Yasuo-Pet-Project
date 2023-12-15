const crypto = require('crypto');
const validator = require('validator');
const { AppError, catchAsync, sendEmail } = require('../utils');
const { User } = require('../models');

exports.signup = catchAsync(async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;

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
exports.login = (req, res, next) => res.status(200).json({ status: 'success' });

exports.logout = catchAsync((req, res, next) => {
  req.logout(error => {
    if (error) throw error;
    res.status(200).json({ status: 'success' });
  });
});

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
    const subject = 'Your pass word reset token (only valid for 10 mins)';
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
