const express = require("express");
const Product = require("../models/Product");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// Add New Product
router.post("/add-product",  async (req, res) => {
    
    try {
        const { name, price, stock, description, image } = req.body;
        if (!name || !price || !stock) {
            return res.status(400).json({ message: "Name, price, and stock are required." });
        }
        const product = new Product({ name, price, stock, description, image });
        await product.save();
    
   
    res.status(201).json({ message: "Product added successfully", product: product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = router;
