const crypto = require('crypto');
const validator = require('validator');
const { AppError, catchAsync, sendEmail } = require('../utils');
const { User } = require('../models');

exports.getMe = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    user: req.user,
  });
};

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
    throw new AppError('User is already active!', 400, 'ACTIVATE_ACTIVE_ERROR');

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
    message: 'Token has been sent, please check your email',
  });
});

exports.activateAccount = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    activateToken: hashedToken,
    activateTokenAt: { $gt: Date.now() },
  });

  console.log(user);

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

  if (user.googleID || user.githubID || user.appleID)
    throw new AppError(
      'Only get username of accounts created manually!',
      403,
      'FORGOT_USERNAME_OAUTH_ERROR'
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
    message: 'Token has been sent, please check your email',
  });
});
