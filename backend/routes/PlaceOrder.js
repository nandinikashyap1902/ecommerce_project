const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/place-order", verifyToken, async (req, res) => {
  const { shippingAddress } = req.body;

  try {
    const userId = req.user.id;

    // Fetch user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // Validate product availability and calculate total price
    let totalPrice = 0;
    const products = cart.items.map((item) => {
      if (item.productId.stock < item.quantity) {
        console.log("stock", item.productId.stock)
        console.log("quantity",item.quantity)
        throw new Error(`Insufficient stock for ${item.productId.name}.`);
      }

      totalPrice += item.quantity * item.productId.price;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price, // Include price in each product entry
      };
    });

    // Create order
    const order = new Order({
      userId,
      products,
      totalPrice,
      shippingAddress,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    // Save order and clear the cart
    await order.save();
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order.", error: error.message });
  }
});
  

module.exports = router;
