const mongoose = require("mongoose");

const rdvSchema = new mongoose.Schema(
  {
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    service: { type: String, required: true },
    status: {
      type: String,
      enum: ["en attente", "terminé", "annulé"],
      default: "en attente",
    },
  },
  { timestamps: true }
);

const Rdv = mongoose.model("Rdv", rdvSchema);

module.exports = Rdv;
