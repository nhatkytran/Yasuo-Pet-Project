const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { createTokenAndHash } = require('../utils');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username!'],
    unique: true,
    trim: true,
    minLength: 5,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  googleID: { type: String },
  googleOAuthCode: { type: String, select: false },
  active: { type: Boolean, default: false },
  activateToken: { type: String, select: false },
  activateTokenAt: { type: Date, select: false },
  ban: { type: Boolean, default: false },
  lastLogin: { type: Date },
  photo: { type: String, default: '/img/default.png' },
  // Don't validate password here (login using Google doesn't need password)
  password: { type: String, select: false },
  passwordConfirm: { type: String },
  passwordChangedAt: { type: Date, select: false },
  forgotPasswordToken: { type: String, select: false },
  forgotPasswordTokenAt: { type: Date, select: false },
  purchasedSkins: [
    {
      index: { type: Number },
      name: { type: String },
      price: { type: Number },
      description: { type: String },
      image: { type: String },
      quantity: { type: Number },
      skins: [
        {
          receipt: { type: String },
          code: { type: String },
          date: { type: Date },
          active: { type: Boolean },
        },
      ],
    },
  ],
});

schema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    if (!this.isNew) this.passwordChangedAt = Date.now();
  }

  next();
});

schema.methods.changedPassword = function () {
  if (this.passwordChangedAt) {
    const loginTimestamp = this.lastLogin.getTime();
    const passwordChangedTimestamp = this.passwordChangedAt.getTime();

    return loginTimestamp < passwordChangedTimestamp;
  }

  return false;
};

schema.methods.createActivateToken = function () {
  const { token, hashedToken } = createTokenAndHash({ randomBytes: 6 });

  this.activateToken = hashedToken;
  this.activateTokenAt = Date.now() + 2 * 60 * 1000;

  return token;
};

schema.methods.createForgotPasswordToken = function () {
  const { token, hashedToken } = createTokenAndHash({ randomBytes: 6 });

  this.forgotPasswordToken = hashedToken;
  this.forgotPasswordTokenAt = Date.now() + 2 * 60 * 1000;

  return token;
};

schema.methods.createGoogleOAuthCode = function () {
  const { token: code, hashedToken: hashedCode } = createTokenAndHash({
    randomBytes: 6,
  });

  this.googleOAuthCode = `${hashedCode}.${Date.now() + 2 * 60 * 1000}`;
  return code;
};

const cltName = 'users';
const User = mongoose.model('User', schema, cltName);

module.exports = User;
