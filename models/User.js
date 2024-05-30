const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  profileId: String,
  FullName: String,
  profilePicture: String,
  email: String,
});

const userModel = model("User", userSchema);

// module.exports = mongoose.model('User', userSchema);

module.exports = userModel;
