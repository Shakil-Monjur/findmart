const express = require("express");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");

const { upload } = require("../middleware/upload");

const router = express.Router();

// Middleware to extract user from JWT token if present
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.headers["x-auth-token"]) {
    token = req.headers["x-auth-token"];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "supersecretkey123"
      );
      req.user = decoded;
    } catch (err) {
      console.error("Token verification failed:", err.message);
    }
  }
  next();
};

// @route   POST /api/products
// @desc    Create a new product post
// @access  Private / Logged in
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    const seller = req.user?.id || req.body.seller || req.body.sellerId;

    if (!seller) {
      return res.status(401).json({ message: "Seller authentication required" });
    }

    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: "Title, description, and price are required" });
    }

    const imageUrl = req.file ? req.file.path : (image || "");

    const newProduct = new Product({
      seller,
      title,
      description,
      price: Number(price),
      image: imageUrl,
    });

    const savedProduct = await newProduct.save();
    const populatedProduct = await savedProduct.populate("seller", "fullName email role profilePicture");

    return res.status(201).json(populatedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products
// @desc    Fetch all products/posts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("seller", "fullName email role profilePicture")
      .sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/products/seller/:sellerId
// @desc    Fetch posts belonging specifically to a logged-in seller
// @access  Public / Private
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ seller: sellerId })
      .populate("seller", "fullName email role profilePicture")
      .sort({ createdAt: -1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Allow a seller to edit their post
// @access  Private
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (req.file) {
      product.image = req.file.path;
    } else if (image !== undefined) {
      product.image = image;
    }

    const updatedProduct = await product.save();
    const populatedProduct = await updatedProduct.populate("seller", "fullName email role profilePicture");

    return res.status(200).json(populatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Allow a seller to delete their post if needed
// @access  Private
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Product deleted successfully", id: req.params.id });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
