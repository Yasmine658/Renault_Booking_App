const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    chassisNumber: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    rdvs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rdv" }],
  },
  { discriminatorKey: "carType", timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
