const express = require("express");
const {
  createUser,
  getAllUsers,
  getAllRDVs,
  changeRDVStatus,
  changeGuestRDVStatus,
} = require("../controllers/adminController");
const router = express.Router();
router.post("/user", createUser);
router.get("/users", getAllUsers);
router.get("/rdv", getAllRDVs);
router.put("/:userId/:carId/:rdvId", changeRDVStatus);
router.put("/guest/:carId/:rdvId",changeGuestRDVStatus)

module.exports = router;
