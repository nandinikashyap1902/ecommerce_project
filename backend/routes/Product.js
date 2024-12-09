const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// Fetch all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products); // Ensure response sends data
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

module.exports = router;
