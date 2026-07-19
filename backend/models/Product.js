const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    barcode: {
      type: String,
      unique: true
    },

    category: String,
    brand: String,

    price: {
      type: Number,
      required: true
    },

    costPrice: {
      type: Number,
      default: 0
    },

    stock: {
      type: Number,
      default: 0
    },

    minStock: {
      type: Number,
      default: 5
    },

    gst: {
      type: Number,
      default: 0
    },

    expiryDate: Date,
    supplier: String,
    image: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);