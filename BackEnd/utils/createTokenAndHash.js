const crypto = require('crypto');
const hashToken = require('./hashToken');

const createTokenAndHash = ({ randomBytes }) => {
  const token = crypto.randomBytes(randomBytes).toString('hex');
  const hashedToken = hashToken(token);

  return { token, hashedToken };
};

module.exports = createTokenAndHash;
