import validator from 'validator';

const isPasswordValid = password =>
  validator.isStrongPassword(password, {
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });

export default isPasswordValid;
