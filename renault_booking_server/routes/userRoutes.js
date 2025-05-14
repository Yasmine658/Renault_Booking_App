const express = require("express");
const upload = require("../middlewares/upload");

const {
  getInfo,
  createCar,
  getAllCars,
  deleteCar, 
  createRDV,
  editRDV,
  getAllRDV,
  deleteRDV, 
  createGuestRDV,
  createGuestCar,
} = require("../controllers/userController");

const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");
const userController = require("../controllers/userController");

router.get("/:userId", getInfo);
router.post(
  "/:userId/car",
  upload.single("registrationCard"), 
  createCar
);
router.get("/:userId/cars", getAllCars);
router.post("/:userId/:carId/rdv", createRDV);
router.post("/:carId/rdv", createGuestRDV);
router.post('/cars/guest',upload.single('registrationCard'), createGuestCar);
router.put("/:userId/:carId/:rdvId", editRDV);
router.get("/:userId/rdv", getAllRDV);
router.delete("/:userId/car/:carId", deleteCar);
router.delete("/:userId/rdv/:rdvId", deleteRDV);
router.put("/:userId", authenticateToken, userController.updateUser);


module.exports = router;
