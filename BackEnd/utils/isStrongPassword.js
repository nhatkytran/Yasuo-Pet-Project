const validator = require('validator');

const isStrongPassword = password =>
  validator.isStrongPassword(password, {
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

module.exports = isStrongPassword;
