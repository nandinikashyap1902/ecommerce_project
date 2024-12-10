const express = require("express");
const Product = require("../models/Product");

const router = express.Router();


router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products); 
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
});

module.exports = router;
