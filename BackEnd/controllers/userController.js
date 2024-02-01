const crypto = require('crypto');
const validator = require('validator');
const bcrypt = require('bcrypt');

const {
  AppError,
  catchAsync,
  sendEmail,
  isStrongPassword,
} = require('../utils');

const { User } = require('../models');

exports.getMe = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
};

exports.sendSolo = catchAsync(async (req, res, next) => {
  const { inGameName, challengeeEmail } = req.body;

  if (inGameName.trim().length < 5)
    throw new Error('inGameName must be 5+ characters!', 400);
  if (!validator.isEmail(challengeeEmail))
    throw new Error('Please provide a valid challengeeEmail!', 400);

  const user = await User.findOne({ username: inGameName });

  if (!user)
    throw new AppError(
      "Your in-game name doesn't exist!",
      404,
      'SEND_SOLO_NAME_ERROR'
    );

  try {
    const subject = 'I challenge you to a 1 v/s 1 battle';
    const message = `Are you up for it? Find me in game: ${user.username} or send me email via < ${user.email} >.`;

    await sendEmail({ email: user.email, subject, message });
  } catch (error) {
    throw new AppError(
      'Something went wrong sending email! Please try again.',
      500
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Email has been sent successfully!',
  });
});

exports.getActivateCode = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email))
    throw new AppError('Please provide a valid email!', 400);

  const user = await User.findOne({ email });

  if (!user)
    throw new AppError(
      `Incorrect email!`,
      400,
      'ACTIVATE_AUTHENTICATION_ERROR'
    );

  if (user.googleID || user.githubID || user.appleID)
    throw new AppError(
      'This feature only supports accounts created manually!',
      403,
      'ACTIVATE_OAUTH_ERROR'
    );

  if (user.active)
    throw new AppError(
      'User is already active! Login now.',
      400,
      'ACTIVATE_ACTIVE_ERROR'
    );

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
      'Something went wrong sending email! Please try again.',
      500
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Token has been sent! Please check your email.',
  });
});

exports.activateAccount = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    activateToken: hashedToken,
    activateTokenAt: { $gt: Date.now() },
  });

  if (!user)
    throw new AppError(
      'Invalid token or token has expired!',
      401,
      'ACTIVATE_TOKEN_ERROR'
    );

  user.active = true;
  user.activateToken = undefined;
  user.activateTokenAt = undefined;

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    message: 'Activate account successfully!',
  });
});

exports.forgotUsername = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email))
    throw new AppError('Please provide a valid email!', 400);

  const user = await User.findOne({ email });

  if (!user)
    throw new AppError(
      `Incorrect email!`,
      400,
      'FORGOT_USERNAME_AUTHENTICATION_ERROR'
    );

  try {
    const subject = 'Your username';
    const message = `Your username: ${user.username}`;

    await sendEmail({ email, subject, message });
  } catch (error) {
    throw new AppError(
      'Something went wrong sending email! Please try again.',
      500
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Username has been sent! Please check your email.',
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email))
    throw new AppError('Please provide a valid email!', 400);

  const user = await User.findOne({ email });

  if (!user)
    throw new AppError(
      `Incorrect email!`,
      400,
      'FORGOT_PASSWORD_AUTHENTICATION_ERROR'
    );

  if (user.googleID || user.githubID || user.appleID)
    throw new AppError(
      'Only get password of accounts created manually!',
      403,
      'FORGOT_PASSWORD_OAUTH_ERROR'
    );

  const forgotPasswordToken = await user.createForgotPasswordToken();
  await user.save({ validateModifiedOnly: true });

  try {
    const subject = 'Your forgot-password code (only valid for 2 mins)';
    const message = `Your forgot-password code: ${forgotPasswordToken}`;

    await sendEmail({ email, subject, message });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenAt = undefined;

    await user.save({ validateModifiedOnly: true });

    throw new AppError(
      'Something went wrong sending email! Please try again.',
      500,
      'FORGOT_PASSWORD_SEND_EMAIL_ERROR'
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'Password has been sent! Please check your email.',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword)
    throw new Error('Please provide token and newPassword!', 400);

  if (isStrongPassword(newPassword))
    throw new AppError(
      'Password must contain at least 8 characters (1 uppercase, 1 lowercase, 1 number, 1 symbol)',
      400
    );

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordTokenAt: { $gt: Date.now() },
  });

  if (!user)
    throw new AppError(
      'Invalid token or token has expired!',
      401,
      'FORGOT_PASSWORD_TOKEN_ERROR'
    );

  user.password = newPassword;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenAt = undefined;

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    message: 'Change password successfully!',
  });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!validator.isEmail(email))
    throw new AppError('Please provide a valid email!', 400);

  const user = await User.findOne({ email }).select('+password');

  if (!user) throw new AppError('Email does not exist!', 404);

  if (!isStrongPassword(currentPassword) || !isStrongPassword(newPassword))
    throw new AppError(
      'Password must contain at least 8 characters (1 uppercase, 1 lowercase, 1 number, 1 symbol)',
      400
    );

  if (!(await bcrypt.compare(currentPassword, user.password)))
    throw new AppError(
      'The current password is incorrect! Please try again.',
      400,
      'CHANGE_PASSWORD_INCORRECT_ERROR'
    );

  if (await bcrypt.compare(newPassword, user.password))
    throw new AppError(
      'The new password is the same as the current one!',
      400,
      'CHANGE_PASSWORD_INCORRECT_ERROR'
    );

  user.password = newPassword;
  await user.save({ validateModifiedOnly: true });

  req.logout(error => {
    if (error) console.error(error);
    res.status(200).json({
      status: 'success',
      message: 'Change password successfully!',
    });
  });
});
