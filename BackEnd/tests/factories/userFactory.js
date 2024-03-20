const mongoose = require('mongoose');
const crypto = require('crypto');

const User = mongoose.model('User');

const randomString = () => crypto.randomBytes(6).toString('hex');

exports.userFactory = async () => {
  let username = randomString();
  let email = `${randomString()}@gmail.com`;

  while (true) {
    const user = await User.findOne({ username, email });

    if (!user) break;

    username = randomString();
    email = `${randomString()}@gmail.com`;
  }

  const data = {
    username,
    email,
    password: `${randomString()}3M$`,
  };

  const user = await User.create(data);

  return { id: user._id.toString(), ...data };
};

exports.deleteUserFactory = async userID =>
  await User.findByIdAndRemove(userID);
