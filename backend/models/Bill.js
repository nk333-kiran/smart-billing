const mongoose = require("mongoose");

const billItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },

  name: String,

  quantity: Number,

  price: Number,

  gst: Number,

  subtotal: Number
});

const billSchema = new mongoose.Schema(
  {
    billNumber: {
      type: String,
      unique: true
    },

    items: [billItemSchema],

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer"
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "card", "upi", "netbanking", "razorpay"]
    },

    subtotal: Number,
    tax: Number,
    discount: Number,
    totalAmount: Number,

    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Paid"
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment"
    },
    paymentDate: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);