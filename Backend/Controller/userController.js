const User = require("../Model/userModel");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const securepassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error);
  }
};

const signUpUser = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({ error: "email already exists" });
    }

    const spassword = await securepassword(password);

    const userData = new User({
      username,
      email,
      phone,
      password: spassword,
      profilePicture: `/uploads/${req.file.filename}`,
    });
    const saveUserData = await userData.save();
    if (!saveUserData) {
      return res.json({ error: "something went wrong", success: false });
    }
    return res.json({ user: userData, success: true });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Searching for user with email:", email);

    const userData = await User.findOne({ email: email });
    console.log("User data found:", userData);

    if (!userData) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { username: userData.username },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );
    console.log("Generated token:", token);

    return res.status(200).json({ user: userData, token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUserData = async (req, res) => {
  try {
    console.log(req.params);
    const userId = req.params.userId;
    const userData = await User.findOne({ _id: userId });
    console.log("userData", userData);
    return res.json({ user: userData, token: req.user });
  } catch (error) {}
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, phone } = req.body;
    const profilePicture = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Failed to update user" });
  }
};

module.exports = {
  signUpUser,
  loginUser,
  getUserData,
  updateUser,
};
