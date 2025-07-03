const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
require("dotenv").config();

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, notes, userId, orderId } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt,
      notes,
    };
    
    const order = await razorpay.orders.create(options);
    
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

// Verify payment
router.post("/verify-payment", async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId,
      amount,
      userId
    } = req.body;
    
    // Creating the hmac object
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    
    // Passing the data to be hashed
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    
    // Creating the hmac in the required format
    const generatedSignature = hmac.digest("hex");
    
    // Verifying the signature
    const isSignatureValid = generatedSignature === razorpay_signature;
    
    if (isSignatureValid) {
      // Payment is successful
      // Save payment details to database
      const payment = new Payment({
        orderId,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount,
        status: "captured",
        user: userId
      });
      
      await payment.save();
      
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        payment
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

// Get Razorpay key
router.get("/get-razorpay-key", (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
  });
});

// Get payment by order ID
router.get("/payment/:orderId", async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }
    
    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
});

module.exports = router;