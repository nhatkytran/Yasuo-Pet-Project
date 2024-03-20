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

  // Test
  app.get('/createTestUser', async (req, res, next) => {
    const randomString = () => crypto.randomBytes(6).toString('hex');

    let username = randomString();
    let email = `${randomString()}@gmail.com`;

    while (true) {
      const user = await User.findOne({ username, email });

      if (!user) break;

      username = randomString();
      email = `${randomString()}@gmail.com`;
    }

    const data = { username, email };

    const user = await User.create(data);

    const JEST_SIGN_SESSION_SECRET = 'Icutes3M';

    const key = await pbkdf2Async(
      JSON.stringify(data),
      JEST_SIGN_SESSION_SECRET,
      10000,
      32,
      'sha256'
    );

    const session = `${user._id.toString()}.${key.toString('hex')}`;

    console.log(session);

    res.status(200).json({ status: 'success' });
  });
};
