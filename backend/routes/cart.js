const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { verifyToken } = require("../middleware/authMiddleware"); // Middleware for authentication

const router = express.Router();

// Add to Cart
router.post("/add", verifyToken, async (req, res) => {
  const { productId, quantity } = req.body;
console.log({ productId, quantity })
 
    try {
      const { productId, quantity } = req.body;
  
      // Validate request body
      if (!productId || !quantity) {
        return res.status(400).json({ message: "Product ID and quantity are required." });
      }
  
      // Validate product existence
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
  
      if (product.stock < quantity) {
        return res.status(400).json({ message: "Insufficient stock." });
      }
  
      // Find or create cart for the authenticated user
      let cart = await Cart.findOne({ userId: req.user._id });
      if (!cart) {
        cart = new Cart({ userId: req.user._id, items: [] });
      }
  
      // Update or add product to the cart
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity; // Update quantity
      } else {
        cart.items.push({ productId, quantity }); // Add new product
      }
  
      // Save the cart
      await cart.save();
  
      res.status(200).json({ message: "Product added to cart successfully!", cart });
    } catch (error) {
      console.error("Error in /add:", error); // Log the actual error
      res.status(500).json({ message: "Server error", error: error.message });
    }
  
});

module.exports = router;
