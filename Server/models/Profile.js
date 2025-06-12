const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  firstName: String,
  lastName: String,
  phone: String,
  email: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zipcode: String,
  profilePic: String // store image filename or URL
});

module.exports = mongoose.model('Profile', profileSchema);
