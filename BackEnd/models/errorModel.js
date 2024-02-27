const mongoose = require('mongoose');

const shema = new mongoose.Schema({
  when: { type: Date, required: true },
  where: { type: String, required: true },
  error: {
    message: { type: String },
    stackJSONFormat: { type: String },
  },
});

const cltName = 'errors';
const ErrorToAdmin = mongoose.model('ErrorToAdmin', shema, cltName);

module.exports = ErrorToAdmin;
