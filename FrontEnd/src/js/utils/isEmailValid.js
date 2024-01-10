import validator from 'validator';

const isEmailValid = email => validator.isEmail(email);
export default isEmailValid;
