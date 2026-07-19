const Bill = require("../models/Bill");
const Product = require("../models/Product");

exports.createBill = async (req, res) => {
  try {
    const {
      items,
      customer,
      paymentMethod,
      subtotal,
      tax,
      discount,
      totalAmount,
    } = req.body;

    for (let item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    const bill = await Bill.create({
      items,
      customer: customer || undefined,
      paymentMethod,
      subtotal,
      tax,
      discount,
      totalAmount,
      status: req.body.status || "Paid",
      cashier: req.user.id,
      billNumber: "INV-" + Date.now(),
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("customer", "name phone")
      .sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("customer", "name phone email address")
      .populate("items.productId", "name")
      .populate("paymentId");
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json({ message: "Bill deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
