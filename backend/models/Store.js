const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema(
  {
    storeName: String,
    ownerName: String,
    phone: String,
    address: String,
    gstNumber: String,
    invoicePrefix: {
      type: String,
      default: "INV"
    },
    logo: String,
    defaultTax: {
      type: Number,
      default: 18
    },
    invoiceFooter: {
      type: String,
      default: "Thank you for shopping! Visit Again!"
    },
    printerWidth: {
      type: String,
      enum: ["58mm", "80mm"],
      default: "80mm"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeSchema);
