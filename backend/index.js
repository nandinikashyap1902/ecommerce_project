require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
const cartRoutes = require("./routes/cart");
app.use("/api", cartRoutes);
const adminRoutes = require("./routes/admin");
app.use("/api/admin", adminRoutes);
const productRoutes = require("./routes/product");
app.use("/api", productRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI,)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log(err));
