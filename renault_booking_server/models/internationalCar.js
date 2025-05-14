const Car = require("./car");
const mongoose = require("mongoose");

const internationalCarSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true },
  registrationCountry: { type: String, required: true },
  registrationCard: { type: String, required: false },
  internationalInsurance: { type: String, required: true },
});

const InternationalCar = Car.discriminator(
  "InternationalCar",
  internationalCarSchema
);

module.exports = InternationalCar;
