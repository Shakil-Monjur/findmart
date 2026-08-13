/* global process */
const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");

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
      console.error("Order auth verification failed:", err.message);
    }
  }
  next();
};

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private / Logged in
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const buyer = req.user?.id || req.body.buyer || req.body.buyerId;

    if (!buyer) {
      return res.status(401).json({ message: "Buyer authentication required" });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    if (totalAmount === undefined || totalAmount < 0) {
      return res.status(400).json({ message: "Valid total amount is required" });
    }

    const formattedItems = items.map((item) => ({
      product: item.product || item._id || item.id,
      quantity: Number(item.quantity) || 1,
      price: Number(item.price) || 0,
      title: item.title || "",
      image: item.image || "",
    }));

    const newOrder = new Order({
      buyer,
      items: formattedItems,
      totalAmount: Number(totalAmount),
      shippingAddress: shippingAddress || {},
      status: "Pending",
    });

    const savedOrder = await newOrder.save();
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("buyer", "fullName email role profilePicture")
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName email role profilePicture" },
      });

    return res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/myorders
// @desc    Get logged in buyer's past orders
// @access  Private
router.get("/myorders", authMiddleware, async (req, res) => {
  try {
    const buyerId = req.user?.id || req.query.buyerId || req.headers["x-user-id"];

    if (!buyerId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const orders = await Order.find({ buyer: buyerId })
      .populate("buyer", "fullName email role profilePicture")
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName email role profilePicture" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch my orders error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/orders/shop-orders
// @desc    Get received orders for shop owner
// @access  Private
router.get("/shop-orders", authMiddleware, async (req, res) => {
  try {
    const sellerId = req.user?.id || req.query.sellerId || req.headers["x-user-id"];

    const allOrders = await Order.find()
      .populate("buyer", "fullName email role profilePicture")
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName email role profilePicture" },
      })
      .sort({ createdAt: -1 });

    if (!sellerId) {
      return res.status(200).json(allOrders);
    }

    // Filter orders where at least one item belongs to this seller
    const sellerOrders = allOrders.filter((order) => {
      return order.items.some((item) => {
        const prodSeller = item.product?.seller?._id || item.product?.seller || item.product?.sellerId;
        return prodSeller && prodSeller.toString() === sellerId.toString();
      });
    });

    return res.status(200).json(sellerOrders.length > 0 ? sellerOrders : allOrders);
  } catch (error) {
    console.error("Fetch shop orders error:", error);
    return res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (e.g. Pending -> Delivered)
// @access  Private
router.put("/:id/status", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("buyer", "fullName email role profilePicture")
      .populate({
        path: "items.product",
        populate: { path: "seller", select: "fullName email role profilePicture" },
      });

    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
