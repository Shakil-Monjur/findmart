const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/findmart")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authRoutes);
app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Basic test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
