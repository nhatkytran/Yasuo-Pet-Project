const crypto = require('crypto');

const createTokenAndHash = ({ randomBytes }) => {
  const token = crypto.randomBytes(randomBytes).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  return { token, hashedToken };
};

module.exports = createTokenAndHash;
