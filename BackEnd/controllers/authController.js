const { AppError, catchAsync } = require('../utils');
const { User } = require('../models');

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    password: String(password),
    passwordConfirm: String(passwordConfirm),
  });

  res.status(200).json({ status: 'success', user });
});
