import validator from 'validator';

const isActivateCodeValid = code =>
  validator.isAlphanumeric(code) &&
  validator.isLength(code, { min: 12, max: 12 });

export default isActivateCodeValid;
