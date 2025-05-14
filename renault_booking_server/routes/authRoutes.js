const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  token,
  logout,
} = require("../controllers/authController");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/token", token);
router.delete("/logout", logout);

module.exports = router;
