const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  contactNumber: String,
  googleId: String,
  avatar: String,
});

module.exports = mongoose.model('User', userSchema);
