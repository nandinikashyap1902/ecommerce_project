const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Place Order Endpoint
// Place Order API (server-side)
router.post("/place-order", verifyToken, async (req, res) => {
    const { shippingAddress } = req.body; // Shipping address from frontend
    const userId = req.user.id; // User ID from the token
  console.log(userId )
    try {
      if (!shippingAddress) {
        return res.status(400).json({ message: "Shipping address is required." });
      }
  
      // Check if there are products in the cart
      const cart = await Cart.findOne({ userId });
      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Your cart is empty." });
      }
  
      // Calculate total price and check product availability
      let totalPrice = 0;
      for (let item of cart.items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.productId} not found.` });
        }
  
        // Check if stock is sufficient
        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.name}. Only ${product.stock} available.`
          });
        }
  
        totalPrice += product.price * item.quantity;
      }
  
      // Create the order
      const newOrder = new Order({
        userId,
        products: cart.items,
        totalPrice,
        shippingAddress,
        paymentStatus: "Pending",
        orderStatus: "Pending",
      });
  
      await newOrder.save();
  
      // Clear the user's cart
      await Cart.findOneAndUpdate({ userId }, { $set: { items: [] } });
  
      return res.status(200).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  

module.exports = router;
