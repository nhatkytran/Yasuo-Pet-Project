import validator from 'validator';
import { LOGIN_USERNAME_LENGTH } from '../config';

const isUsernameValid = username =>
  validator.isLength(username, {
    min: LOGIN_USERNAME_LENGTH,
  });

export default isUsernameValid;
