const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  numSecu: Number,
  password: String,
  token: String,
  likes: [String],
  ordonnances: [String]
});

const User = mongoose.model('users', userSchema);

module.exports = User;