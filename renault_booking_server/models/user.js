const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  CIN: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
