const Car = require("./car");
const mongoose = require("mongoose");

const localCarSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true },
  registrationCard: { type: String, required: false },
});

const LocalCar = Car.discriminator("LocalCar", localCarSchema);

module.exports = LocalCar;
