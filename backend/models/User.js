const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username must be provided!"],
  },
  password: {
    type: String,
    required: [true, "password must be provided!"],
  },
  email: {
    type: String,
    required: [true, "email must be provided!"],
    unique: [true, "email must be unique!"],
  },
  desc: {
    type: String,
  },
  link: {
    type: String,
  },
  cover: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
