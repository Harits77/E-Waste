const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    image: String,
    description: String,
    price: Number,
    contact: String,
    userId: String,
    sold: { type: Boolean, default: false },
    buyerId: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
