/* global process */
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary version 2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "findmart",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
  },
});

const upload = multer({ storage });

// @route   POST /api/auth/signup
// @desc    Register a new user (Customer or Shop Owner)
// @access  Public
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, role, latitude, longitude, lat, lng } = req.body;

    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const finalLat = latitude !== undefined && latitude !== null ? latitude : lat;
    const finalLng = longitude !== undefined && longitude !== null ? longitude : lng;

    const user = new User({
      fullName,
      email,
      password,
      role,
      latitude: finalLat ? Number(finalLat) : null,
      longitude: finalLng ? Number(finalLng) : null,
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
        latitude: user.latitude,
        longitude: user.longitude,
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
        latitude: user.latitude,
        longitude: user.longitude,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/users/profile or /api/auth/profile
// @desc    Get user profile details including saved latitude and longitude
// @access  Public / Logged in
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    let targetId = req.query.userId || req.query.id || req.query._id;

    if (token && !targetId) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey123");
        targetId = decoded.id;
      } catch {
        // ignore
      }
    }

    if (!targetId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(targetId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture || "",
        profilePic: user.profilePicture || "",
        latitude: user.latitude,
        longitude: user.longitude,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/profile or /api/auth/profile
// @desc    Update user profile details including latitude and longitude
// @access  Public / Logged in
router.put("/profile", async (req, res) => {
  console.log("DEBUG SAVE [1] - Incoming req.body:", req.body);

  try {
    const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
    let decodedId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecretkey123");
        decodedId = decoded.id;
      } catch {
        // ignore
      }
    }

    const { userId, id, _id, fullName, email } = req.body;
    const targetId = userId || id || _id || decodedId;

    if (!targetId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("DEBUG SAVE [2] - Found User:", user.email, "Current Lat/Lng:", user.latitude, user.longitude);

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;

    if (req.body.latitude !== undefined && req.body.latitude !== null) {
      user.latitude = Number(req.body.latitude);
    } else if (req.body.lat !== undefined && req.body.lat !== null) {
      user.latitude = Number(req.body.lat);
    }

    if (req.body.longitude !== undefined && req.body.longitude !== null) {
      user.longitude = Number(req.body.longitude);
    } else if (req.body.lng !== undefined && req.body.lng !== null) {
      user.longitude = Number(req.body.lng);
    }

    try {
      await user.save();
      console.log("DEBUG SAVE [3] - Successfully Saved Lat/Lng:", user.latitude, user.longitude);
    } catch (error) {
      console.error("DEBUG SAVE [ERROR] - MongoDB Save Failed:", error.message);
      return res.status(500).json({ message: "MongoDB Save Failed: " + error.message });
    }

    const responseUser = {
      _id: user._id,
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture || "",
      profilePic: user.profilePicture || "",
      latitude: user.latitude,
      longitude: user.longitude,
    };

    return res.status(200).json({
      success: true,
      message: "Location saved successfully",
      user: responseUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
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

    const imageUrl = req.file.path;

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
      latitude: updatedUser.latitude,
      longitude: updatedUser.longitude,
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
