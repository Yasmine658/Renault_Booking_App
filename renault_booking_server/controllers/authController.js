const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.signUp = async (req, res) => {
    const { CIN, username, password, email, phoneNumber } = req.body;

    if (!CIN || !username || !password || !email || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const existingUser = await User.findOne({
        $or: [{ username }, { email }, { CIN }],
      });
  
      if (existingUser) {
        return res
          .status(409)
          .json({ message: "User with given username, email, or CIN already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        CIN,
        username,
        password: hashedPassword,
        email,
        phoneNumber,
      });
  
      await newUser.save();
  
      res.status(201).json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          CIN: newUser.CIN,
          username: newUser.username,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
        },
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Error registering user", error });
    }
  };

  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Cannot find user" });
  
      if (await bcrypt.compare(password, user.password)) {
        const accessToken = generateAccessToken({ id: user._id, name: user.username });
        const refreshToken = jwt.sign(
          { id: user._id, name: user.username },
          process.env.REFRESH_TOKEN_SECRET
        );
        res.json({ accessToken, refreshToken });
      } else {
        res.status(403).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  };
  
exports.token = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ id: user.id, name: user.name });
    res.json({ accessToken });
  });
};

exports.logout = (req, res) => {
  res.sendStatus(204);
};

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}