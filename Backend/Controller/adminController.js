const User = require("../Model/userModel");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const adminData = await User.findOne({ email });

    if (!adminData) {
      return res.status(404).json({ error: "Invalid email", success: false });
    }

    const passwordMatch = await bcrypt.compare(password, adminData.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Invalid password", success: false });
    }

    if (!adminData.isAdmin) {
      return res.status(403).json({ error: "Not an admin", success: false });
    }
    const token = jwt.sign(
      { username: adminData.username },
      process.env.SECRET_KEY,
      { expiresIn: "2h" }
    );

    return res.status(200).json({ admin: adminData, token });
  } catch (error) {
    console.error("Error in loginAdmin:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", success: false });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const userData = await User.find({ isAdmin: false });
    return res.json({ users: userData });
  } catch (error) {
    console.log(error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { username, email, phone } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username,
          email,
          phone,
          ...(req.file && { profilePicture: `/uploads/${req.file.filename}` }),
        },
      },
      { new: true }
    );

    return res.json({ user: updatedUser, success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the user profile." });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    console.log("User ID to delete:", userId);

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "User deleted successfully", success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};

const adduser = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({ error: "email already exists" });
    }

    const userData = new User({
      username,
      email,
      phone,
      profilePicture: `/uploads/${req.file.filename}`,
    });
    const saveUserData = await userData.save();
    if (!saveUserData) {
      return res.json({ error: "something went wrong", succces: false });
    }
    return res.json({ user: userData, success: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginAdmin,
  fetchUsers,
  updateUser,
  deleteUser,
  adduser,
};
