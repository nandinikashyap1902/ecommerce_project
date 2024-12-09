const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
    image: { type: String }, 
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
