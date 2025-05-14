const User = require("../models/user");
const Car = require("../models/car");
const Rdv = require("../models/rdv");

const createUser = async (req, res) => {
  const { CIN, username, email, phoneNumber } = req.body;

  if (!CIN || !username || !email || !phoneNumber) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ CIN }, { email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = new User({
      CIN,
      username,
      email,
      phoneNumber,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully.",
      user: {
        _id: newUser._id,
        CIN: newUser.CIN,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating user", error: err });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate({
      path: "cars",
      populate: {
        path: "rdvs",
        model: "Rdv",
      },
    });

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};

const getAllRDVs = async (req, res) => {
  try {
    const rdvs = await Rdv.find().populate({
      path: "carId",
      populate: {
        path: "userId",
        model: "User",
        select: "username email",
      },
    });

    res.status(200).json(rdvs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching RDVs", error: err });
  }
};

const changeRDVStatus = async (req, res) => {
  const { userId, carId, rdvId } = req.params;
  const { status } = req.body;

  if (!["en attente", "terminé", "annulé"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  try {
    const car = await Car.findOne({ _id: carId, userId });

    if (!car) {
      return res.status(404).json({ message: "Car not found for this user." });
    }

    const rdv = await Rdv.findOneAndUpdate(
      { _id: rdvId, carId },
      { status },
      { new: true }
    );

    if (!rdv) {
      return res.status(404).json({ message: "RDV not found." });
    }

    res.status(200).json({ message: "RDV status updated successfully", rdv });
  } catch (err) {
    res.status(500).json({ message: "Error updating RDV", error: err });
  }
};

const changeGuestRDVStatus = async (req, res) => {
  const { carId, rdvId } = req.params;
  const { status } = req.body;
  if (!["en attente", "annulé", "terminé"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }
  try {
    const rdv = await Rdv.findOneAndUpdate(
      { _id: rdvId, carId },
      { status },
      { new: true }
    );
    
    if (!rdv) {
      return res.status(404).json({ message: "RDV not found" });
    }
    res.status(200).json({ message: "RDV status updated successfully", rdv });
  } catch (err) {
    res.status(500).json({ message: "Error updating RDV", error: err });
  }
};
module.exports = {
  createUser,
  getAllUsers,
  getAllRDVs,
  changeRDVStatus,
  changeGuestRDVStatus,
};
