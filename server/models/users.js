const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name:String,
  email: String,
  password: String,
  score: Number,
});

const UserModel = mongoose.model("login", UserSchema);

module.exports = UserModel;