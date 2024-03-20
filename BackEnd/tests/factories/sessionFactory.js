const crypto = require('crypto');
const util = require('util');

const { JEST_SIGN_SESSION_SECRET } = process.env;

const pbkdf2Async = util.promisify(crypto.pbkdf2);

const sessionFactory = async user => {
  const { username, email } = user;

  const key = await pbkdf2Async(
    JSON.stringify({ username, email }),
    JEST_SIGN_SESSION_SECRET,
    10000,
    32,
    'sha256'
  );

  return `${user.id}.${key.toString('hex')}`;
};

module.exports = sessionFactory;
