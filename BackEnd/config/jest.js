const crypto = require('crypto');
const util = require('util');
const cookie = require('cookie');

const { User } = require('../models');

const pbkdf2Async = util.promisify(crypto.pbkdf2);

const { JEST_SIGN_SESSION_SECRET } = process.env;

module.exports = app => {
  const pbkdf2Options = data => [
    JSON.stringify(data),
    JEST_SIGN_SESSION_SECRET,
    10000,
    32,
    'sha256',
  ];

  app.use(async (req, res, next) => {
    const session = cookie.parse(req.headers.cookie || '')['connect.jest'];

    if (!session) return next();

    const [userID, signature] = session.split('.');

    const user = await User.findById(userID);

    if (!user) return next();

    const key = await pbkdf2Async(
      ...pbkdf2Options({ username: user.username, email: user.email })
    );

    if (key.toString('hex') === signature) req.user = user;

    next();
  });
};
