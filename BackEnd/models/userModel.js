const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username!'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email!'],
  },
  googleID: { type: String },
  active: { type: Boolean, default: false },
  ban: { type: Boolean, default: false },
  lastLogin: { type: Date },
  photo: { type: String, default: '/img/default.jpg' },
  // Don't validate password here (login using Google doesn't need password)
  password: { type: String, select: false },
  passwordConfirm: { type: String },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  passwordChangedAt: { type: Date },
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
    const loginTimestamp = parseInt(this.lastLogin.getTime() / 1000);
    const passwordChangedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000
    );

    return loginTimestamp < passwordChangedTimestamp;
  }

  return false;
};

schema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(64).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  this.passwordResetToken = hashedToken;
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return token;
};

const cltName = 'users';
const User = mongoose.model('User', schema, cltName);

module.exports = User;
