const mongoose = require('mongoose');
const validator = require('validator');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  active: {
    type: Boolean,
    default: false,
  },
  photo: {
    type: String,
    default: '/img/default.jpg',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: 'Password confirm - Failed!',
    },
  },
});

const cltName = 'users';
const User = mongoose.model('User', schema, cltName);

module.exports = User;
