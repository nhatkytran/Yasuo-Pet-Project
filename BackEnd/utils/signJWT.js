const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const signJWT = async user => {
  const token = await jwt.sign({ id: user._id.toString() }, JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: 30 * 24 * 60 * 60,
  });

  const metadata = await jwt.verify(token, JWT_SECRET, { algorithm: 'HS256' });

  return [token, metadata];
};

module.exports = signJWT;
