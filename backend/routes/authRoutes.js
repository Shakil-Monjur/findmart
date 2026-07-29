const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, "avatar-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// @route   POST /api/auth/signup
// @desc    Register a new user (Customer or Shop Owner)
// @access  Public
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const user = new User({
      fullName,
      email,
      password,
      role,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || "",
        profilePic: user.profilePicture || "",
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "supersecretkey123",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || "",
        profilePic: user.profilePicture || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/users/update-profile-picture or /api/auth/update-profile-picture
// @desc    Upload profile picture file and update user document in MongoDB
// @access  Public / Logged in
router.post("/update-profile-picture", upload.single("profilePicture"), async (req, res) => {
  try {
    const userId = req.body.userId || req.body.id || req.body._id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: imageUrl },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const responseUser = {
      _id: updatedUser._id,
      id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      profilePic: updatedUser.profilePicture,
    };

    return res.status(200).json({
      message: "Profile picture updated successfully",
      user: responseUser,
    });
  } catch (error) {
    console.error("Profile picture upload error:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
