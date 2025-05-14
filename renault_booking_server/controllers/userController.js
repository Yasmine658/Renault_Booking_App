const User = require("../models/user");
const Car = require("../models/car");
const LocalCar = require("../models/localCar");
const InternationalCar = require("../models/internationalCar");
const Rdv = require("../models/rdv");

const getInfo = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("cars");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const createCar = async (req, res) => {
  const { carType, ...carData } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let car;
    const registrationCard = req.file ? req.file.path.replace(/\\/g, "/") : null;


    if (carType === "LocalCar") {
      car = new LocalCar({ ...carData, userId: user._id, registrationCard });
    } else if (carType === "InternationalCar") {
      car = new InternationalCar({ ...carData, userId: user._id ,registrationCard });
    } else {
      return res.status(400).json({ message: "Invalid car type" });
    }
    const existingCar = await Car.findOne({ chassisNumber: carData.chassisNumber });
    if (existingCar) {
      return res.status(400).json({ message: "A car with this chassis number already exists." });
    }


    await car.save();
    user.cars.push(car._id);
    await user.save();

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    res.status(201).json(car);
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
  
};



const createGuestCar = async (req, res) => {
  try {
    if (!req.body.model || !req.body.plateNumber || !req.body.chassisNumber) {
      return res.status(400).json({ 
        message: "Model, plate number and chassis number are required" 
      });
    }

    const registrationCardPath = req.file 
      ? req.file.path.replace(/\\/g, '/') 
      : null;

    let newCar;
    if (req.body.carType === "InternationalCar") {
      newCar = new InternationalCar({
        model: req.body.model,
        plateNumber: req.body.plateNumber,
        chassisNumber: req.body.chassisNumber,
        registrationCountry: req.body.registrationCountry,
        internationalInsurance: req.body.internationalInsurance,
        registrationCard: registrationCardPath,
        isGuestCar: true
      });
    } else {
      newCar = new LocalCar({
        model: req.body.model,
        plateNumber: req.body.plateNumber,
        chassisNumber: req.body.chassisNumber,
        registrationCard: registrationCardPath,
        isGuestCar: true
      });
    }

    await newCar.save();

    return res.status(201).json(newCar);

  } catch (error) {
    console.error("Error in createGuestCar:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        message: "A car with these details already exists",
        field: Object.keys(error.keyPattern)[0]
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map(e => e.message)
      });
    }

    return res.status(500).json({ 
      message: "Failed to create car",
      error: error.message 
    });
  }
};

const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.params.userId });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const createGuestRDV = async (req, res) => {
  console.log("Creating guest RDV with params:", req.params);
  console.log("Creating guest RDV with body:", req.body);


  const { date, location, service, carModel, status, plateNumber } = req.body;
  const { carId } = req.params;

  try {
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const rdv = new Rdv({
      carId: car._id,
      date,
      location,
      service,
      carModel,
      status,
      plateNumber,
      isGuestRdv: true,
    });

    await rdv.save();

    car.rdvs.push(rdv._id);
    await car.save();

    res.status(201).json(rdv);
  } catch (err) {
    console.error("createGuestRDV error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const createRDV = async (req, res) => {
  const { date, location, service } = req.body;
  const { carId, userId } = req.params;
  try {
    const car = await Car.findOne(
      userId
        ? { _id: carId, userId }
        : { _id: carId }
      );
    if (!car) return res.status(404).json({ message: "Car not found" });

    const rdv = new Rdv({
      carId: car._id,
      date,
      location,
      service,
    });

    await rdv.save();

    car.rdvs.push(rdv._id);
    await car.save();

    res.status(201).json(rdv);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const editRDV = async (req, res) => {
  const { date, location, service, status } = req.body;

  try {
    const rdv = await Rdv.findOne({
      _id: req.params.rdvId,
      carId: req.params.carId,
    });

    if (!rdv) return res.status(404).json({ message: "RDV not found" });

    if (date) rdv.date = date;
    if (location) rdv.location = location;
    if (service) rdv.service = service;
    if (status) rdv.status = status;

    await rdv.save();

    res.json(rdv);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRDV = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.params.userId });
    const carIds = cars.map((car) => car._id);

    const rdvs = await Rdv.find({ carId: { $in: carIds } }).sort({ date: 1 });

    res.json(rdvs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({
      _id: req.params.carId,
      userId: req.params.userId,
    });

    if (!car) return res.status(404).json({ message: "Car not found" });

    await Rdv.deleteMany({ carId: car._id });
    await User.updateOne(
      { _id: req.params.userId },
      { $pull: { cars: req.params.carId } }
    );

    res.json({ message: "Car and its RDVs deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


const deleteRDV = async (req, res) => {
  try {
    const rdv = await Rdv.findByIdAndDelete(req.params.rdvId);
    if (!rdv) return res.status(404).json({ message: "RDV not found" });

    await Car.updateOne({ _id: rdv.carId }, { $pull: { rdvs: rdv._id } });

    res.json({ message: "RDV deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, CIN, email, phoneNumber } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, CIN, email, phoneNumber },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  updateUser,
  getInfo,
  createCar,
  getAllCars,
  createRDV,
  editRDV,
  getAllRDV,
  deleteCar,
  deleteRDV,
  createGuestRDV,
  createGuestCar,
};
